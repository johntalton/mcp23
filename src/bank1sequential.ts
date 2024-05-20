import { I2CAddressedBus } from '@johntalton/and-other-delights'
import { Mode, PORT, Port } from './defines.js'
import { REGISTERS_BANK_1 } from './defines.js'
import { Converter } from './converter.js'

export const BLOCK_BANK_1_BY_PORT = {
	[PORT.A]: {
		OFFSET: REGISTERS_BANK_1.IODIRA,
		LENGTH: 11
	},
	[PORT.B]: {
		OFFSET: REGISTERS_BANK_1.IODIRB,
		LENGTH: 11
	}
}

export class CommonBank1Sequential {
	static async getPort(aBus: I2CAddressedBus, _mode: Mode, port: Port) {
		const block = BLOCK_BANK_1_BY_PORT[port]
		const buffer = await aBus.readI2cBlock(block.OFFSET, block.LENGTH)
		return Converter.decodePort(buffer)
	}
}
