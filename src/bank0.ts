import { I2CAddressedBus } from '@johntalton/and-other-delights'
import {
	Digital,
	Direction,
	EnabledInterrupt,
	EnabledInversePolarity,
	InterruptControl,
	InterruptFlag,
	Mode,
	PullUp,
	REGISTERS_BANK_0,
	REGISTERS_BANK_1
} from './defines.js'
import { Converter } from './converter.js'

export const BYTE_LENGTH_TWO = 2


export const REGISTERS_FOR_SEQUENTIAL = [
	{
		IODIR: REGISTERS_BANK_0.IODIRA,
		IPOL: REGISTERS_BANK_0.IPOLA,
		GPINTEN: REGISTERS_BANK_0.GPINTENA,
		DEFVAL: REGISTERS_BANK_0.DEFVALA,
		INTCON: REGISTERS_BANK_0.INTCONA,
		IOCON: REGISTERS_BANK_0.IOCON,
		GPPU: REGISTERS_BANK_0.GPPUA,
		INTF: REGISTERS_BANK_0.INTFA,
		INTCAP: REGISTERS_BANK_0.INTCAPA,
		GPIO: REGISTERS_BANK_0.GPIOA,
		OLAT: REGISTERS_BANK_0.OLATA
	},
	{
		IODIR: REGISTERS_BANK_1.IODIRA,
		IPOL: REGISTERS_BANK_1.IPOLA,
		GPINTEN: REGISTERS_BANK_1.GPINTENA,
		DEFVAL: REGISTERS_BANK_1.DEFVALA,
		INTCON: REGISTERS_BANK_1.INTCONA,
		IOCON: REGISTERS_BANK_1.IOCON,
		GPPU: REGISTERS_BANK_1.GPPUA,
		INTF: REGISTERS_BANK_1.INTFA,
		INTCAP: REGISTERS_BANK_1.INTCAPA,
		GPIO: REGISTERS_BANK_1.GPIOA,
		OLAT: REGISTERS_BANK_1.OLATA
	}
]


export class CommonBank0 {
	static async getDirections(aBus: I2CAddressedBus, mode: Mode): Promise<Array<Direction>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_FOR_SEQUENTIAL[mode.bank].IODIR, BYTE_LENGTH_TWO)
		return Converter.decodeDirection(buffer)
	}

	static async getPolarities(aBus: I2CAddressedBus, mode: Mode): Promise<Array<EnabledInversePolarity>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_FOR_SEQUENTIAL[mode.bank].IPOL, BYTE_LENGTH_TWO)
		return Converter.decodePolarity(buffer)
	}

	static async getInterrupts(aBus: I2CAddressedBus, mode: Mode): Promise<Array<EnabledInterrupt>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_FOR_SEQUENTIAL[mode.bank].GPINTEN, BYTE_LENGTH_TWO)
		return Converter.decodeInterrupt(buffer)
	}

	static async getDefaultValues(aBus: I2CAddressedBus, mode: Mode): Promise<Array<Digital>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_FOR_SEQUENTIAL[mode.bank].DEFVAL, BYTE_LENGTH_TWO)
		return Converter.decodeDigital(buffer)
	}

	static async getInterruptControls(aBus: I2CAddressedBus, mode: Mode): Promise<Array<InterruptControl>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_FOR_SEQUENTIAL[mode.bank].INTCON, BYTE_LENGTH_TWO)
		return Converter.decodeInterruptControl(buffer)
	}

	static async getPullUps(aBus: I2CAddressedBus, mode: Mode): Promise<Array<PullUp>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_FOR_SEQUENTIAL[mode.bank].GPPU, BYTE_LENGTH_TWO)
		return Converter.decodePullUp(buffer)
	}

	static async getInterruptFlags(aBus: I2CAddressedBus, mode: Mode): Promise<Array<InterruptFlag>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_FOR_SEQUENTIAL[mode.bank].INTF, BYTE_LENGTH_TWO)
		return Converter.decodeInterruptFlag(buffer)
	}

	static async getInterruptCaptureValues(aBus: I2CAddressedBus, mode: Mode): Promise<Array<Digital>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_FOR_SEQUENTIAL[mode.bank].INTCAP, BYTE_LENGTH_TWO)
		return Converter.decodeDigital(buffer)
	}

	static async getOutputValues(aBus: I2CAddressedBus, mode: Mode): Promise<Array<Digital>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_FOR_SEQUENTIAL[mode.bank].GPIO, BYTE_LENGTH_TWO)
		return Converter.decodeDigital(buffer)
	}

	static async getOutputLatchValues(aBus: I2CAddressedBus, mode: Mode): Promise<Array<Digital>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_FOR_SEQUENTIAL[mode.bank].OLAT, BYTE_LENGTH_TWO)
		return Converter.decodeDigital(buffer)
	}
}
