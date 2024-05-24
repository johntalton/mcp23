import { I2CBufferSource } from '@johntalton/and-other-delights'
import {
	BANK_1,
	DIRECTION,
	HIGH,
	INTERRUPT_CONTROL,
	LOW
} from './defines.js'
import {
	Digital,
	Direction,
	EnabledInterrupt,
	EnabledInversePolarity,
	InterruptControl,
	InterruptFlag,
	PullUp
} from './defines.js'

export const BIT_SET = 1
export const BIT_UNSET = 0

export const SINGLE_BIT_MASK = 0b1

export class Converter {
  static decodeIocon(buffer: I2CBufferSource) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const [ value ] = u8

		const bank = (value >> 7) & SINGLE_BIT_MASK
		const mirror = ((value >> 6) & SINGLE_BIT_MASK) === BIT_SET
		const seqop = ((value >> 5) & SINGLE_BIT_MASK) === BIT_SET
		const disslw = ((value >> 4) & SINGLE_BIT_MASK) === BIT_SET
		const haen = ((value >> 3) & SINGLE_BIT_MASK) === BIT_SET
		const odr = ((value >> 2) & SINGLE_BIT_MASK) === BIT_SET
		const intpol = ((value >> 1) & SINGLE_BIT_MASK) === BIT_SET

		return {
			slew: !disslw,
			hardwareAddress: haen,

			mode: {
				bank,
				sequential: !seqop
			},
			interrupt: {
				mirror,
				openDrain: odr,
				interruptPolarityHigh: intpol
			}
		}
	}

  static decodePort(buffer: I2CBufferSource) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const direction = Converter.decodeDirection(u8.subarray(0, 1))
		const polarity = Converter.decodePolarity(u8.subarray(1, 2))
		const interrupt = Converter.decodeInterrupt(u8.subarray(2, 3))
		const defaultValue = Converter.decodeDigital(u8.subarray(3, 4))
		const interruptControl = Converter.decodeInterruptControl(u8.subarray(4, 5))
		// iocon
		const pullUp = Converter.decodePullUp(u8.subarray(6, 7))
		// flags
		// capture
		// gpio
		const outputLatchValue = Converter.decodeDigital(u8.subarray(10, 11))

		return {
			direction,
			polarity,
			interrupt,
			defaultValue,
			interruptControl,
			pullUp,
			outputLatchValue
		}
	}

	static decodePorts(_buffer: I2CBufferSource) {
		throw new Error('no impl')
	}

  static decodeDigital(buffer: I2CBufferSource): Array<Digital> {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const [ value ] = u8

		return [
			((value & (SINGLE_BIT_MASK << 0)) !== 0) ? HIGH : LOW,
			((value & (SINGLE_BIT_MASK << 1)) !== 0) ? HIGH : LOW,
			((value & (SINGLE_BIT_MASK << 2)) !== 0) ? HIGH : LOW,
			((value & (SINGLE_BIT_MASK << 3)) !== 0) ? HIGH : LOW,
			((value & (SINGLE_BIT_MASK << 4)) !== 0) ? HIGH : LOW,
			((value & (SINGLE_BIT_MASK << 5)) !== 0) ? HIGH : LOW,
			((value & (SINGLE_BIT_MASK << 6)) !== 0) ? HIGH : LOW,
			((value & (SINGLE_BIT_MASK << 7)) !== 0) ? HIGH : LOW
		]
	}

  static decodeDirection(buffer: I2CBufferSource): Array<Direction> {
		const digit = Converter.decodeDigital(buffer)
		return digit.map(d => d === BIT_SET ? DIRECTION.IN : DIRECTION.OUT)
	}

  static decodePolarity(buffer: I2CBufferSource): Array<EnabledInversePolarity> {
		const digit = Converter.decodeDigital(buffer)
		return digit.map(d => d === BIT_SET)
	}

  static decodeInterrupt(buffer: I2CBufferSource): Array<EnabledInterrupt> {
		const digit = Converter.decodeDigital(buffer)
		return digit.map(d => d === BIT_SET)
	}

	static decodeInterruptControl(buffer: I2CBufferSource): Array<InterruptControl> {
		const digit = Converter.decodeDigital(buffer)
		return digit.map(d => d === BIT_SET ? INTERRUPT_CONTROL.DEFAULT_VALUE : INTERRUPT_CONTROL.PREVIOUS_VALUE)
	}

  static decodePullUp(buffer: I2CBufferSource): Array<PullUp> {
		const digit = Converter.decodeDigital(buffer)
		return digit.map(d => d === BIT_SET)
	}

  static decodeInterruptFlag(buffer: I2CBufferSource): Array<InterruptFlag> {
		const digit = Converter.decodeDigital(buffer)
		return digit.map(d => d === BIT_SET)
	}

  // ---

	static encodeIocon(iocon, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {
		const u8 = ArrayBuffer.isView(into) ?
			new Uint8Array(into.buffer, into.byteOffset, into.byteLength) :
			new Uint8Array(into)

		const {
			slew,
			hardwareAddress,
			interrupt,
			mode
		} = iocon

		const { mirror, openDrain, interruptPolarityHigh } = interrupt
		const { bank, sequential } = mode

		u8[0] = 0 |
			(bank === BANK_1 ? SINGLE_BIT_MASK << 7 : 0) |
			(mirror ? SINGLE_BIT_MASK << 6 : 0) |
			(!sequential ? SINGLE_BIT_MASK << 5 : 0) |
			(!slew ? SINGLE_BIT_MASK << 4 : 0) |
			(hardwareAddress ? SINGLE_BIT_MASK << 3 : 0) |
			(openDrain ? SINGLE_BIT_MASK << 2 : 0) |
			(interruptPolarityHigh ? SINGLE_BIT_MASK << 1 : 0)

		return into.buffer
	}

  static encodeDigital(value: Array<Digital>, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {
		const u8 = ArrayBuffer.isView(into) ?
			new Uint8Array(into.buffer, into.byteOffset, into.byteLength) :
			new Uint8Array(into)

		u8[0] = 0 |
			(value[0] === HIGH ? 1 << 0 : 0) |
			(value[1] === HIGH ? 1 << 1 : 0) |
			(value[2] === HIGH ? 1 << 2 : 0) |
			(value[3] === HIGH ? 1 << 3 : 0) |
			(value[4] === HIGH ? 1 << 4 : 0) |
			(value[5] === HIGH ? 1 << 5 : 0) |
			(value[6] === HIGH ? 1 << 6 : 0) |
			(value[7] === HIGH ? 1 << 7 : 0)

		return u8.buffer
  }

	static encodeDirection(value: Array<Direction>, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {
		return Converter.encodeDigital(value.map(v => v === DIRECTION.IN ? BIT_SET : BIT_UNSET), into)
	}

	static encodePolarity(value: Array<EnabledInversePolarity>, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {
		return Converter.encodeDigital(value.map(v => v ? BIT_SET : BIT_UNSET), into)
	}

	static encodeInterrupt(value: Array<EnabledInterrupt>, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {
		return Converter.encodeDigital(value.map(v => v ? BIT_SET : BIT_UNSET), into)
	}

	static encodeInterruptControl(value: Array<InterruptControl>, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {
		return Converter.encodeDigital(value.map(v => v === INTERRUPT_CONTROL.DEFAULT_VALUE ? BIT_SET : BIT_UNSET), into)
	}

	static encodePullUp(value: Array<PullUp>, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {
		return Converter.encodeDigital(value.map(v => v ? BIT_SET : BIT_UNSET), into)
	}
}
