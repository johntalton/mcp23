import { I2CAddressedTransactionBus, BlockList } from '@johntalton/and-other-delights'

import { CommonBank1 } from './commonbank1.js'
import { REGISTERS_BANK1 } from './registers.js'

// read
const FIRST_BLOCK_START = REGISTERS_BANK1.IODIRA
const SECOND_BLOCK_START = REGISTERS_BANK1.IODIRB

const FIRST_BLOCK_SIZE = 8
const SECOND_BLOCK_SIZE = 8
// 1

const PIN_STATE_DUAL_BLOCKS_READ: BlockList = [
	[FIRST_BLOCK_START, FIRST_BLOCK_SIZE],
	[REGISTERS_BANK1.OLATA, 1],
	[SECOND_BLOCK_START, SECOND_BLOCK_SIZE],
	[REGISTERS_BANK1.OLATB, 1]
]

const BULK_DATA_DUAL_BLOCKS_READ: BlockList = [
	[REGISTERS_BANK1.INTFA, 4],
	[REGISTERS_BANK1.INTFB, 4]
]

// write
const WRITE_RUN_SIZE = 5
// 1
// 1

const PIN_STATE_DUAL_BLOCKS_WRITE: BlockList = [
	[FIRST_BLOCK_START, WRITE_RUN_SIZE], // todo move gpinten AB to end
	[REGISTERS_BANK1.GPPUA, 1],
	[REGISTERS_BANK1.OLATA, 1],
	[SECOND_BLOCK_START, WRITE_RUN_SIZE],
	[REGISTERS_BANK1.GPPUB, 1],
	[REGISTERS_BANK1.OLATB, 1]
]

/**
 *
 **/
export class CommonDualBlocks {
	static async state(bus: I2CAddressedTransactionBus) {
		return CommonBank1.state(bus, PIN_STATE_DUAL_BLOCKS_READ)
	}

	static async exportAll(bus: I2CAddressedTransactionBus, buffer) {
		return CommonBank1.exportAll(bus, PIN_STATE_DUAL_BLOCKS_WRITE, buffer)
	}

	static async readPort(bus: I2CAddressedTransactionBus, register) {
		return CommonBank1.readPort(bus, register)
	}

	static async readAB(bus: I2CAddressedTransactionBus, registerA, registerB) {
		return CommonBank1.readAB(bus, registerA, registerB)
	}

	static async writePort(bus: I2CAddressedTransactionBus, register, value) {
		return CommonBank1.writePort(bus, register, value)
	}

	static async bulkData(bus: I2CAddressedTransactionBus) {
		return CommonBank1.bulkData(bus, BULK_DATA_DUAL_BLOCKS_READ)
	}
}
