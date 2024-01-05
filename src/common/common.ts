/* eslint-disable max-classes-per-file */
import { I2CAddressedTransactionBus } from '@johntalton/and-other-delights'

import { Banks, CommonMode, matchCommonMode } from '../defines.js'
import { Mode } from '../types.js'

import { Common16bitPoll } from './common16bitpoll.js'
import { Common8bitPoll } from './common8bitpoll.js'
import { CommonDirect } from './commondirect.js'
import { CommonDualBlocks } from './commondualblocks.js'
import { CommonInterlacedBlock } from './commoninterlacedblock.js'

import { REGISTERS } from './registers.js'

/**
 * Duck type class for common interface, to support modeSelection class.
 **/
export class CommonReject {
	static async state() { return Promise.reject(Error('common reject state')) }
	static async exportAll() { return Promise.reject(Error('common reject exportAll')) }
	static async readPort() { return Promise.reject(Error('common reject readPort')) }
	static async readAB() { return Promise.reject(Error('common reject readAB')) }
	static async writePort() { return Promise.reject(Error('common reject writePort')) }
	static async bulkData() { return Promise.reject(Error('common reject bulkData')) }
}

export const proxyFromMode = (mode: Mode) => (matchCommonMode(mode, CommonMode.MODE_MAP_8BIT_POLL) ? Common8bitPoll :
	matchCommonMode(mode, CommonMode.MODE_MAP_16BIT_POLL) ? Common16bitPoll :
		matchCommonMode(mode, CommonMode.MODE_MAP_DUAL_BLOCKS) ? CommonDualBlocks :
			matchCommonMode(mode, CommonMode.MODE_MAP_INTERLACED_BLOCK) ? CommonInterlacedBlock :
				CommonReject)


/**
 *
 **/
export class Common extends CommonDirect {
	// helper to read and name memory mapped buffer
	static statusMemmapToNamedBytes(buf, mode: Mode) {
		const iocon = buf.readUInt8(REGISTERS[mode.bank].IOCON)
		const ioconAlt = buf.readUInt8(REGISTERS[mode.bank].IOCON_ALT)
		if (iocon !== ioconAlt) { throw new Error('iocon miss-match: ' + iocon.toString(16) + ' != ' + ioconAlt.toString(16)) }
		// todo also could validate low bit and mode from iocon

		const a = {
			iodir: buf.readUInt8(REGISTERS[mode.bank].IODIRA),
			iopol: buf.readUInt8(REGISTERS[mode.bank].IPOLA),
			gpinten: buf.readUInt8(REGISTERS[mode.bank].GPINTENA),
			defval: buf.readUInt8(REGISTERS[mode.bank].DEFVALA),
			intcon: buf.readUInt8(REGISTERS[mode.bank].INTCONA),
			gppu: buf.readUInt8(REGISTERS[mode.bank].GPPUA),
			intf: buf.readUInt8(REGISTERS[mode.bank].INTFA),
			olat: buf.readUInt8(REGISTERS[mode.bank].OLATA)
		}

		const b = {
			iodir: buf.readUInt8(REGISTERS[mode.bank].IODIRB),
			iopol: buf.readUInt8(REGISTERS[mode.bank].IPOLB),
			gpinten: buf.readUInt8(REGISTERS[mode.bank].GPINTENB),
			defval: buf.readUInt8(REGISTERS[mode.bank].DEFVALB),
			intcon: buf.readUInt8(REGISTERS[mode.bank].INTCONB),
			gppu: buf.readUInt8(REGISTERS[mode.bank].GPPUB),
			intf: buf.readUInt8(REGISTERS[mode.bank].INTFB),
			olat: buf.readUInt8(REGISTERS[mode.bank].OLATB)
		}

		console.log(iocon, a, b)
		return {
			iocon: iocon,
			a: a,
			b: b
		}
	}

	// fetch the state (gpio list and profile) in one go using proper mode
	static async state(bus: I2CAddressedTransactionBus, mode: Mode) {
		const buffer = await proxyFromMode(mode).state(bus)
		return Common.statusMemmapToNamedBytes(buffer, mode)
	}

	// set the entire gpio in one go using proper mode
	static async exportAll(bus: I2CAddressedTransactionBus, mode: Mode, exports) {
		console.log('common exportAll', exports)
		if (exports.profile !== undefined) { throw new Error('setting profile during exportAll not recommended') }

		// todo this creates our memory map, however we need to
		// explicitly call out its size and calculate  in some const some place
		// its also of note that while this buffer should be the correct size
		// an over size buffer works well also :P
		const buffer = mode.bank === Banks.BANK0 ? Uint8Array.from({ length: 22 }, () => 0) : Uint8Array.from({ length: 27 }, () => 0)

		const { a, b } = exports // short hand a bit
		buffer[a.iodir] = REGISTERS[mode.bank].IODIRA
		buffer[a.iopol] = REGISTERS[mode.bank].IPOLA
		buffer[a.gpinten] = REGISTERS[mode.bank].GPINTENA
		buffer[a.defval] = REGISTERS[mode.bank].DEFVALA
		buffer[a.intcon] = REGISTERS[mode.bank].INTCONA
		buffer[a.gppu] = REGISTERS[mode.bank].GPPUA
		buffer[a.olat] = REGISTERS[mode.bank].OLATA

		buffer[b.iodir] = REGISTERS[mode.bank].IODIRB
		buffer[b.iopol] = REGISTERS[mode.bank].IPOLB
		buffer[b.gpinten] = REGISTERS[mode.bank].GPINTENB
		buffer[b.defval] = REGISTERS[mode.bank].DEFVALB
		buffer[b.intcon] = REGISTERS[mode.bank].INTCONB
		buffer[b.gppu] = REGISTERS[mode.bank].GPPUB
		buffer[b.olat] = REGISTERS[mode.bank].OLATB // todo suppress or support suppression

		console.log('buffer', buffer)

		return proxyFromMode(mode).exportAll(bus, buffer)
	}

	// read bulk data registers via proper mode
	static async bulkData(bus: I2CAddressedTransactionBus, mode: Mode) {
		const buffer = await proxyFromMode(mode).bulkData(bus)
		console.log('bulkData memory map', buffer)

		const buffer8 = new Uint8Array(buffer)


		// convert buffer to named values
		return {
			intfA: buffer8[REGISTERS[mode.bank].INTFA],
			intfB: buffer8[REGISTERS[mode.bank].INTFB],
			intcapA: buffer8[REGISTERS[mode.bank].INTCAPA],
			intcapB: buffer8[REGISTERS[mode.bank].INTCAPB],
			gpioA: buffer8[REGISTERS[mode.bank].GPIOA],
			gpioB: buffer8[REGISTERS[mode.bank].GPIOB],
			olatA: buffer8[REGISTERS[mode.bank].OLATA],
			olatB: buffer8[REGISTERS[mode.bank].OLATB]
		}
	}

	// read single register via proper mode
	static async readPort(bus: I2CAddressedTransactionBus, mode: Mode, register) {
		const buffer = await proxyFromMode(mode).readPort(bus, register)
		const buffer8 = new Uint8Array(buffer)
		return buffer8[0]
	}

	// read dual register (16bit mode if possible) via proper mode
	static async readAB(bus: I2CAddressedTransactionBus, mode: Mode, registerA, registerB) {
		const buffer = await proxyFromMode(mode).readAB(bus, registerA, registerB)
		const buffer8 = new Uint8Array(buffer)
		return {
			A: buffer8[0],
			B: buffer8[1]
		}
	}

	static async writePort(bus: I2CAddressedTransactionBus, mode: Mode, register, value) {
		return proxyFromMode(mode)
			.writePort(bus, register, value)
	}

	// read (alias methods for register names)
	static async readIntfA(bus: I2CAddressedTransactionBus, mode: Mode) { return Common.readPort(bus, mode, REGISTERS[mode.bank].INTFA) }
	static async readIntfB(bus: I2CAddressedTransactionBus, mode: Mode) { return Common.readPort(bus, mode, REGISTERS[mode.bank].INTFB) }
	static async readIntfAB(bus: I2CAddressedTransactionBus, mode: Mode) {
		return Common.readAB(bus, mode, REGISTERS[mode.bank].INTFA, REGISTERS[mode.bank].INTFB)
	}

	static async readGpioA(bus: I2CAddressedTransactionBus, mode: Mode) { return Common.readPort(bus, mode, REGISTERS[mode.bank].GPIOA) }
	static async readGpioB(bus: I2CAddressedTransactionBus, mode: Mode) { return Common.readPort(bus, mode, REGISTERS[mode.bank].GPIOB) }
	static async readGpioAB(bus: I2CAddressedTransactionBus, mode: Mode) {
		return Common.readAB(bus, mode, REGISTERS[mode.bank].GPIOA, REGISTERS[mode.bank].GPIOB)
	}

	static async readIntcapA(bus: I2CAddressedTransactionBus, mode: Mode) {
		return Common.readPort(bus, mode, REGISTERS[mode.bank].INTCAPA)
	}

	static async readIntcapB(bus: I2CAddressedTransactionBus, mode: Mode) {
		return Common.readPort(bus, mode, REGISTERS[mode.bank].INTCAPB)
	}

	static async readIntcapAB(bus: I2CAddressedTransactionBus, mode: Mode) {
		return Common.readAB(bus, mode, REGISTERS[mode.bank].INTCAPA, REGISTERS[mode.bank].INTCAPB)
	}

	static async readOlatA(bus: I2CAddressedTransactionBus, mode: Mode) { return Common.readPort(bus, mode, REGISTERS[mode.bank].OLATA) }
	static async readOlatB(bus: I2CAddressedTransactionBus, mode: Mode) { return Common.readPort(bus, mode, REGISTERS[mode.bank].OLATB) }
	static async readOlatAB(bus: I2CAddressedTransactionBus, mode: Mode) {
		return Common.readAB(bus, mode, REGISTERS[mode.bank].OLATA, REGISTERS[mode.bank].OLATB)
	}

	// write (alias methods for register names)
	static async writeGpioA(bus: I2CAddressedTransactionBus, mode: Mode, value) {
		return Common.writePort(bus, mode, REGISTERS[mode.bank].GPIOA, value)
	}
	static async writeGpioB(_bus: I2CAddressedTransactionBus, _mode: Mode, _value) { throw new Error('writeGpioB') }
	static async writeGpioAB(_bus: I2CAddressedTransactionBus, _mode: Mode, _value) { throw new Error('writeGpioAB') }

	static async writeOlatA(bus: I2CAddressedTransactionBus, mode: Mode, value) {
		return Common.writePort(bus, mode, REGISTERS[mode.bank].OLATA, value)
	}
	static async writeOlatB(_bus: I2CAddressedTransactionBus, _mode: Mode, _value) { throw new Error('writeOlatB') }
	static async writeOlatAB(_bus: I2CAddressedTransactionBus, _mode: Mode, _value) { throw new Error('writeOlatAB') }
}
