import { I2CBufferSource } from '@johntalton/and-other-delights'
import { DIRECTION,
	Digital,
	Direction,
	EnabledInterrupt,
	EnabledInversePolarity,
	HIGH,
	InterruptControl,
	InterruptFlag,
	LOW,
	PullUp
} from './defines.js'

export const SINGLE_BIT_MASK = 0b1

export class Converter {
  static decodeIocon(buffer: I2CBufferSource) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const [ value ] = u8

		return {

		}
	}

  static decodePort(buffer: I2CBufferSource) {}

	static decodePorts(buffer: I2CBufferSource) {}

  static decodeDigital(buffer: I2CBufferSource): Array<Digital> {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const [ value ] = u8

		return [
			((value & (SINGLE_BIT_MASK << 0)) === 1) ? HIGH : LOW,
			((value & (SINGLE_BIT_MASK << 1)) === 1) ? HIGH : LOW,
			((value & (SINGLE_BIT_MASK << 2)) === 1) ? HIGH : LOW,
			((value & (SINGLE_BIT_MASK << 3)) === 1) ? HIGH : LOW,
			((value & (SINGLE_BIT_MASK << 4)) === 1) ? HIGH : LOW,
			((value & (SINGLE_BIT_MASK << 5)) === 1) ? HIGH : LOW,
			((value & (SINGLE_BIT_MASK << 6)) === 1) ? HIGH : LOW,
			((value & (SINGLE_BIT_MASK << 7)) === 1) ? HIGH : LOW
		]
	}

  static decodeDirection(buffer: I2CBufferSource): Array<Direction> {
		const digit = Converter.decodeDigital(buffer)
		return digit.map(d => d === HIGH ? DIRECTION.IN : DIRECTION.OUT)
	}

  static decodePolarity(buffer: I2CBufferSource): Array<EnabledInversePolarity> {
		const digit = Converter.decodeDigital(buffer)
		return digit.map()
	}

  static decodeInterrupt(buffer: I2CBufferSource): Array<EnabledInterrupt> {
		const digit = Converter.decodeDigital(buffer)
		return digit.map()
	}

	static decodeInterruptControl(buffer: I2CBufferSource): Array<InterruptControl> {
		const digit = Converter.decodeDigital(buffer)
		return digit.map()
	}

  static decodePullUp(buffer: I2CBufferSource): Array<PullUp> {
		const digit = Converter.decodeDigital(buffer)
		return digit.map()
	}

  static decodeInterruptFlag(buffer: I2CBufferSource): Array<InterruptFlag> {
		const digit = Converter.decodeDigital(buffer)
		return digit.map()
	}

  // ---

	static encodeIocon(value, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {

		return into.buffer
	}

  static encodeDigital(value: Array<Digital>, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {
		const u8 = ArrayBuffer.isView(into) ?
			new Uint8Array(into.buffer, into.byteOffset, into.byteLength) :
			new Uint8Array(into)


		return u8.buffer
  }

	static encodeDirection(value: Array<Direction>, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {
		return Converter.encodeDigital(value.map(), into)
	}

	static encodePolarity(value: Array<EnabledInversePolarity>, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {
		return Converter.encodeDigital(value.map(), into)
	}

	static encodeInterrupt(value: Array<EnabledInterrupt>, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {
		return Converter.encodeDigital(value.map(), into)
	}

	static encodeInterruptControl(value: Array<InterruptControl>, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {
		return Converter.encodeDigital(value.map(), into)
	}

	static encodePullUp(value: Array<PullUp>, into = Uint8Array.from([ 0x00 ])): ArrayBuffer {
		return Converter.encodeDigital(value.map(), into)
	}
}
