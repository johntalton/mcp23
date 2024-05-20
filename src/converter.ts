import { I2CBufferSource } from '@johntalton/and-other-delights'
import {
	DIRECTION,
	HIGH,
	INTERRUPT_CONTROL,
	LOW,
	PullUp
} from './defines.js'
import {
	Digital,
	Direction,
	EnabledInterrupt,
	EnabledInversePolarity,
	InterruptControl,
	InterruptFlag
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
			hardwareAddressEnabled: haen,

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

  static decodePort(_buffer: I2CBufferSource) {

	}

	static decodePorts(_buffer: I2CBufferSource) {

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

	static encodeIocon(_value, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {

		return into.buffer
	}

  static encodeDigital(_value: Array<Digital>, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {
		const u8 = ArrayBuffer.isView(into) ?
			new Uint8Array(into.buffer, into.byteOffset, into.byteLength) :
			new Uint8Array(into)


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
