import { I2CAddressedBus } from '@johntalton/and-other-delights'
import { Mode } from './defines.js'
import { Converter } from './converter.js'


export const OFFSET = 0
export const LENGTH = 22

export class CommonBank0Sequential {
	static async getPorts(aBus: I2CAddressedBus, mode: Mode) {
		const buffer = await aBus.readI2cBlock(OFFSET, LENGTH)
		return Converter.decodePorts(buffer)
	}
}