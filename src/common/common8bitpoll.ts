import { I2CAddressedTransactionBus, BlockList } from '@johntalton/and-other-delights'

import { CommonBank1 } from './commonbank1.js'
import { REGISTERS_BANK1 } from './registers.js'

// read
const PIN_STATE_8BIT_POLL_READ: BlockList = [
	[REGISTERS_BANK1.IODIRA, 1],
	[REGISTERS_BANK1.IPOLA, 1],
	[REGISTERS_BANK1.GPINTENA, 1],
	[REGISTERS_BANK1.DEFVALA, 1],
	[REGISTERS_BANK1.INTCONA, 1],
	[REGISTERS_BANK1.IOCON, 1],
	[REGISTERS_BANK1.GPPUA, 1],
	[REGISTERS_BANK1.INTFA, 1],
	[REGISTERS_BANK1.OLATA, 1],

	//
	[REGISTERS_BANK1.IODIRB, 1],
	[REGISTERS_BANK1.IPOLB, 1],
	[REGISTERS_BANK1.GPINTENB, 1],
	[REGISTERS_BANK1.DEFVALB, 1],
	[REGISTERS_BANK1.INTCONB, 1],
	[REGISTERS_BANK1.IOCON_ALT, 1],
	[REGISTERS_BANK1.GPPUB, 1],
	[REGISTERS_BANK1.INTFB, 1],
	[REGISTERS_BANK1.OLATB, 1]
]

const BULK_DATA_8BIT_POLL_READ: BlockList = [
	[REGISTERS_BANK1.INTFA, 1],
	[REGISTERS_BANK1.INTCAPA, 1],
	[REGISTERS_BANK1.GPIOA, 1],
	[REGISTERS_BANK1.OLATA, 1],

	[REGISTERS_BANK1.INTFB, 1],
	[REGISTERS_BANK1.INTCAPB, 1],
	[REGISTERS_BANK1.GPIOB, 1],
	[REGISTERS_BANK1.OLATB, 1]
]

// write
const PIN_STATE_8BIT_POLL_WRITE: BlockList = [
	[REGISTERS_BANK1.IODIRA, 1],
	[REGISTERS_BANK1.IPOLA, 1],
	[REGISTERS_BANK1.GPINTENA, 1], // todo move to end
	[REGISTERS_BANK1.DEFVALA, 1],
	[REGISTERS_BANK1.INTCONA, 1],
	[REGISTERS_BANK1.GPPUA, 1],
	[REGISTERS_BANK1.OLATA, 1],

	//
	[REGISTERS_BANK1.IODIRB, 1],
	[REGISTERS_BANK1.IPOLB, 1],
	[REGISTERS_BANK1.GPINTENB, 1], // todo move end
	[REGISTERS_BANK1.DEFVALB, 1],
	[REGISTERS_BANK1.INTCONB, 1],
	[REGISTERS_BANK1.GPPUB, 1],
	[REGISTERS_BANK1.OLATB, 1]
]

/**
 *
 **/
export class Common8bitPoll {
	static async state(bus: I2CAddressedTransactionBus) {
		return CommonBank1.state(bus, PIN_STATE_8BIT_POLL_READ)
	}

	static async exportAll(bus: I2CAddressedTransactionBus, buffer) {
		return CommonBank1.exportAll(bus, PIN_STATE_8BIT_POLL_WRITE, buffer)
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
		return CommonBank1.bulkData(bus, BULK_DATA_8BIT_POLL_READ)
	}
}
