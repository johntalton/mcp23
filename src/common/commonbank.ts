import { BlockList, BusUtil, I2CAddressedBus, I2CAddressedTransactionBus, I2CBufferSource } from '@johntalton/and-other-delights'

/**
 *
 **/
export class CommonBank {
	static async state(bus: I2CAddressedTransactionBus, block: BlockList) {
		return BusUtil.readI2cBlocks(bus, block)
			.then(buffer => BusUtil.expandBlock(block, buffer))
	}

	static async exportAll(bus: I2CAddressedTransactionBus, block: BlockList, buffer: I2CBufferSource) {
		return BusUtil.writeI2cBlocks(bus, block, buffer)
	}

	static async readPort(bus: I2CAddressedTransactionBus, register) {
		return bus.readI2cBlock(register, 1)
	}

	static async writePort(bus: I2CAddressedBus|I2CAddressedTransactionBus, register, value) {
		return bus.writeI2cBlock(register, Uint8Array.from([ value ]))
	}

	static async bulkData(bus: I2CAddressedTransactionBus, block: BlockList) {
		return BusUtil.readI2cBlocks(bus, block)
			.then(buffer => BusUtil.expandBlock(block, buffer))
	}
}
