import { I2CAddressedTransactionBus, BlockList } from '@johntalton/and-other-delights'

import { CommonBank0, WORD_SIZE } from './commonbank0.js'
import { REGISTERS_BANK0 } from './registers.js'

// read
// these could have also been all B first
const IODIR = REGISTERS_BANK0.IODIRA
const IPOL = REGISTERS_BANK0.IPOLA
const GPINTEN = REGISTERS_BANK0.GPINTENA
const DEFVAL = REGISTERS_BANK0.DEFVALA
const INTCON = REGISTERS_BANK0.INTCONA
const IOCON = REGISTERS_BANK0.IOCON // eslint-disable-line prefer-destructuring
const GPPU = REGISTERS_BANK0.GPPUA
const INTF = REGISTERS_BANK0.INTFA
const OLAT = REGISTERS_BANK0.OLATA

const PIN_STATE_16BIT_POLL_READ: BlockList = [
	[IODIR, WORD_SIZE],
	[IPOL, WORD_SIZE],
	[GPINTEN, WORD_SIZE],
	[DEFVAL, WORD_SIZE],
	[INTCON, WORD_SIZE],
	[IOCON, WORD_SIZE],
	[GPPU, WORD_SIZE],
	[INTF, WORD_SIZE],

	[OLAT, WORD_SIZE]
]

const BULK_DATA_16BIT_POLL_READ: BlockList = [
	[REGISTERS_BANK0.INTFA, WORD_SIZE],
	[REGISTERS_BANK0.INTCAPA, WORD_SIZE],
	[REGISTERS_BANK0.GPIOA, WORD_SIZE],
	[REGISTERS_BANK0.OLATA, WORD_SIZE]
]

// write
const PIN_STATE_16BIT_POLL_WRITE: BlockList = [
	[IODIR, WORD_SIZE],
	[IPOL, WORD_SIZE],
	[GPINTEN, WORD_SIZE], // todo move to end
	[DEFVAL, WORD_SIZE],
	[INTCON, WORD_SIZE],
	[GPPU, WORD_SIZE],

	[OLAT, WORD_SIZE]
]

/**
 *
 **/
export class Common16bitPoll {
	static async state(bus: I2CAddressedTransactionBus) {
		return CommonBank0.state(bus, PIN_STATE_16BIT_POLL_READ)
	}

	static async exportAll(bus: I2CAddressedTransactionBus, buffer) {
		return CommonBank0.exportAll(bus, PIN_STATE_16BIT_POLL_WRITE, buffer)
	}

	static async readPort(bus: I2CAddressedTransactionBus, register) {
		return CommonBank0.readPort(bus, register)
	}

	static async readAB(bus: I2CAddressedTransactionBus, registerA, registerB) {
		return CommonBank0.readAB(bus, registerA, registerB)
	}

	static async writePort(bus: I2CAddressedTransactionBus, register, value) {
		return CommonBank0.writePort(bus, register, value)
	}

	static async bulkData(bus: I2CAddressedTransactionBus) {
		return CommonBank0.bulkData(bus, BULK_DATA_16BIT_POLL_READ)
	}
}
