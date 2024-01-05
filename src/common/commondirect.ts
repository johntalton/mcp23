/* eslint-disable sort-imports */
import { BusUtil, I2CAddressedTransactionBus, BlockList } from '@johntalton/and-other-delights'

import { Mode } from '../types.js'
import { Banks, COMMON_MODE_MAP_DEFAULT, CommonMode, matchCommonMode } from '../defines.js'
import { REGISTERS, REGISTERS_BANK0, REGISTERS_BANK1 } from './registers.js'

/**
 * A more direct access to this chip that by-passes the Mode Selection
 *  this allows for some simplicity.
 *
 * Most notably `profile` get/set are here as well as `sniffMode`.
 *
 * Used as the base class for Common itself to isolate the direct access
 *   code used here from Commons more common usage pattern.
 **/
export class CommonDirect {
	// cheat method that sidesteps itself directly writing reset
	static async softwareReset(bus: I2CAddressedTransactionBus) {
		console.log(' ** attempting software reset (zero bytes) ** ')
		return Promise.all(new Array(30).fill(0)
			.map((_, index) => bus.writeI2cBlock(index, Uint8Array.from([ 0 ]))
				.catch(e => { console.log('reset err', index, e) })))
			.then(() => {
				const iocon = 0x08
				return CommonDirect.setProfile(bus, COMMON_MODE_MAP_DEFAULT, iocon)
			})
			.then(() => bus.writeI2cBlock(0, Uint8Array.from([ 0xFF, 0xFF ]))) // iodirA
	}

	// cheat method that sidesteps itself by bit manipulation
	static async sniffMode(bus: I2CAddressedTransactionBus, hint): Promise<Mode> {
		function lowZero(iocon) { return (iocon & 0x01) === 0 }

		function highZero(iocon) { return ((iocon >> 7) & 1) === 0 }

		function allIocon(iocons) {
			const [first] = iocons
			if (!lowZero(first)) { return false }
			return iocons.every(iocon => first === iocon, true)
		}

		// creates a common mode from iocon register
		function guessIocon(i) {
			const bank = (i >> 7) === 1 ? Banks.BANK1 : Banks.BANK0
			const sequential = ((i & 0x20) >> 5) === 0
			// console.log('guessing from iocon 0x' + i.toString(16), bank, sequential);
			return { bank, sequential }
		}

		const block: BlockList = [
			[REGISTERS_BANK0.IOCON, 2],
			[REGISTERS_BANK0.IOCON_ALT, 2],
			[REGISTERS_BANK1.IOCON, 2],
			[REGISTERS_BANK1.IOCON_ALT, 2],
			[REGISTERS_BANK0.IODIRA, 4]
		]

		return BusUtil.readI2cBlocks(bus, block)
			// eslint-disable-next-line complexity
			.then(sniffedAB => {
				console.log('sniffed raw', sniffedAB)

				const sniffed = new DataView(sniffedAB)

				const h = sniffed.getUint8(0)
				const i = sniffed.getUint8(1)
				const j = sniffed.getUint8(2)
				const k = sniffed.getUint8(3)
				const l = sniffed.getUint8(4)
				const m = sniffed.getUint8(5)
				const n = sniffed.getUint8(6)
				const o = sniffed.getUint8(7)
				const run = [
					sniffed.getUint8(8),
					sniffed.getUint8(9),
					sniffed.getUint8(10),
					sniffed.getUint8(11)
				]

				console.log(h, i, j, k, l, m, n, o, run)

				// 0A.. 0B.. 05.. 15..
				//                   h i            j k            l m                 n o
				// interlaced   0/t: [iocon iocona] [iocona gppuA] [gpintenB defvalA]  [olatB undef]
				// dual blocks  1/t: [olatA undef]  [undef undef]  [iocon gppuA]       [iocona gppuB]
				// 16bit        0/f: [iocon iocona] [iocona iocon] [gpintenB gpintenA] [olatB olatA]
				// 8bit         1/f: [olatA olatA]  [undef undef]  [iocon iocon]       [iocona iocona]

				// run 00...
				//
				// interlaced: iodirA iodirB polA polB
				// dual block: iodirA polA gpintenA defvalA
				// 16bit     : iodirA iodirB iodirA iodirB
				// 8bit      : iodirA iodirA iodirA iodirA

				// given this: it is possible to rule out some mode (bank / sequential) configurations

				const hi = h === i
				// const jk = j === k;
				// const lm = l === m;
				// const no = n === o;

				// const hj = h === j;
				const ln = l === n

				const hLz = lowZero(h)
				const lLz = lowZero(l)

				const hHz = highZero(h)
				const lHz = highZero(l)

				const hG = guessIocon(h)
				const lG = guessIocon(l)

				let mib = 0
				let mdb = 0
				let m16p = 0
				let m8p = 0

				// if not all in run equal, then not 8bit
				if (run[0] !== run[1] || run[0] !== run[2] || run[0] !== run[3]) {
					m8p -= Infinity
				}
				// if first and third not equal, then not 16bit
				if (run[0] !== run[2]) {
					m16p -= Infinity
				}

				// must pass to be one of these
				// we do this first as bellow we assume that
				//  when testing (h and l) the tie is already broke
				//  by all equal
				if (!allIocon([h, i, j])) { mib -= Infinity }
				if (!allIocon([l, n])) { mdb -= Infinity }
				if (!allIocon([h, i, j, k])) { m16p -= Infinity }
				if (!allIocon([l, m, n, o])) { m8p -= Infinity }

				// if all possible iocon banks are low, then, not bank1
				if (hHz && lHz) { mdb -= Infinity; m8p -= Infinity }
				// etc, not bank0
				if (!hHz && !lHz) { mib -= Infinity; m16p -= Infinity }

				// if h high reserved low bit, cannot be iocon for bank0
				if (!hLz) { mib -= Infinity; m16p -= Infinity }
				// etc, for bank1
				if (!lLz) { mdb -= Infinity; m8p -= Infinity }

				// iocon not match ioconAlt, can not be bank0
				if (!hi) { mib -= Infinity; m16p -= Infinity }
				// etc, bank1
				if (!ln) { mdb -= Infinity; m8p -= Infinity }

				// if 8bit, hi must match (read olat twice)
				if (!hi) { m8p -= Infinity }

				// the guess must match the iocon setting
				if (!matchCommonMode(hG, CommonMode.MODE_MAP_INTERLACED_BLOCK)) { mib -= Infinity }
				if (!matchCommonMode(lG, CommonMode.MODE_MAP_DUAL_BLOCKS)) { mdb -= Infinity }
				if (!matchCommonMode(hG, CommonMode.MODE_MAP_16BIT_POLL)) { m16p -= Infinity }
				if (!matchCommonMode(lG, CommonMode.MODE_MAP_8BIT_POLL)) { m8p -= Infinity }

				//
				if (m8p === -Infinity && mdb === -Infinity) {
					// bank 0
					const guess = guessIocon(h)
					console.log('struck gold (fools) BANK 0, h is iocon 0x' + h.toString(16), guess)
					return guess
				} else if (m16p === -Infinity && mib === -Infinity) {
					// bank 1
					const guess = guessIocon(l)
					console.log('struck gold (fools) BANK 1, l is iocon 0x' + l.toString(16), guess)
					return guess
				}

				// undef all currently return 0, so that is a good indicator
				if (o === 0) { mib += 1000 }
				if (i === 0 && j === 0 && k === 0) { mdb += 1000 }
				if (j === 0 && k === 0) { m8p += 1000 }
				if (true) { m16p += 1000 } // to be fair

				// hint
				if (hint !== undefined) {
					if (matchCommonMode(hG, hint)) { mib += 1; m16p += 1 }
					if (matchCommonMode(lG, hint)) { mdb += 1; m8p += 1 }
				}

				//
				console.log(mib, mdb, m16p, m8p)
				const guessList: Array<[number, Mode]> = [
					[mib, CommonMode.MODE_MAP_INTERLACED_BLOCK],
					[mdb, CommonMode.MODE_MAP_DUAL_BLOCKS],
					[m16p, CommonMode.MODE_MAP_16BIT_POLL],
					[m8p, CommonMode.MODE_MAP_8BIT_POLL]]

				const guesses = guessList.reduce((acc, cur) => {
					if(cur[0] > acc[0]) { return cur }
					return acc
				})

				const guess = guesses[1]

				if (guess === undefined) { throw new Error('undefined guess') }
				console.log('sniff', guess)
				return guess
			})
			.catch(e => {
				console.log('error sniffing', e)
				return COMMON_MODE_MAP_DEFAULT
			})
	}

	// cheat method that sidesteps itself by direct lookup and read
	static async profile(bus: I2CAddressedTransactionBus, mode: Mode) {
		console.log('profile', mode)
		// we skip the modeSelection here for simplicity
		const buffer = await bus.readI2cBlock(REGISTERS[mode.bank].IOCON, 1)
		const buffer8 = new Uint8Array(buffer)
		return buffer8[0]
	}

	// cheat method that sidesteps itself by direct lookup and write
	static async setProfile(bus: I2CAddressedTransactionBus, mode: Mode, iocon) {
		console.log('setProfile', mode, iocon.toString(2))
		// we skip the modeSelection here for simplicity
		return bus.writeI2cBlock(REGISTERS[mode.bank].IOCON, Uint8Array.from([ iocon ]))
	}
}
