import { I2CAddressedBus } from '@johntalton/and-other-delights'
import {
	Mode,
	Port,
	Direction,
	Control,
	EnabledInversePolarity,
	EnabledInterrupt,
	Digital,
	InterruptControl,
	PullUp,
	InterruptFlag
} from './defines.js'
import {
	REGISTERS_BANK_0,
	REGISTERS_BANK_1,
	PORT
} from './defines.js'
import { Converter } from './converter.js'

export const REGISTERS_BY_BANK = [ REGISTERS_BANK_0, REGISTERS_BANK_1 ]
export const BYTE_LENGTH_ONE = 1

export const REGISTERS_BY_BANK_PORT = [
	{
		[PORT.A]: {
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
		[PORT.B]: {
			IODIR: REGISTERS_BANK_0.IODIRB,
			IPOL: REGISTERS_BANK_0.IPOLB,
			GPINTEN: REGISTERS_BANK_0.GPINTENB,
			DEFVAL: REGISTERS_BANK_0.DEFVALB,
			INTCON: REGISTERS_BANK_0.INTCONB,
			IOCON: REGISTERS_BANK_0.IOCON_ALT,
			GPPU: REGISTERS_BANK_0.GPPUB,
			INTF: REGISTERS_BANK_0.INTFB,
			INTCAP: REGISTERS_BANK_0.INTCAPB,
			GPIO: REGISTERS_BANK_0.GPIOB,
			OLAT: REGISTERS_BANK_0.OLATB
		}
	},
	{
		[PORT.A]: {
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
		},
		[PORT.B]: {
			IODIR: REGISTERS_BANK_1.IODIRB,
			IPOL: REGISTERS_BANK_1.IPOLB,
			GPINTEN: REGISTERS_BANK_1.GPINTENB,
			DEFVAL: REGISTERS_BANK_1.DEFVALB,
			INTCON: REGISTERS_BANK_1.INTCONB,
			IOCON: REGISTERS_BANK_1.IOCON_ALT,
			GPPU: REGISTERS_BANK_1.GPPUB,
			INTF: REGISTERS_BANK_1.INTFB,
			INTCAP: REGISTERS_BANK_1.INTCAPB,
			GPIO: REGISTERS_BANK_1.GPIOB,
			OLAT: REGISTERS_BANK_1.OLATB
		}
	}
]

export class CommonDirect {
	static async getControl(aBus: I2CAddressedBus, mode: Mode): Promise<Control> {
		const buffer = await aBus.readI2cBlock(REGISTERS_BY_BANK[mode.bank].IOCON, BYTE_LENGTH_ONE)
		return Converter.decodeIocon(buffer)
	}

	static async setControl(aBus: I2CAddressedBus, mode: Mode, value: Control) {
		const buffer = Converter.encodeIocon(value)
		return aBus.writeI2cBlock(REGISTERS_BY_BANK[mode.bank].IOCON, buffer)
	}

	static async getDirection(aBus: I2CAddressedBus, mode: Mode, port: Port): Promise<Array<Direction>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].IODIR, BYTE_LENGTH_ONE)
		return Converter.decodeDirection(buffer)
	}

	static async setDirection(aBus: I2CAddressedBus, mode: Mode, port: Port, value: Array<Direction>) {
		const buffer = Converter.encodeDirection(value)
		return aBus.writeI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].IODIR, buffer)
	}

	static async getPolarity(aBus: I2CAddressedBus, mode: Mode, port: Port): Promise<Array<EnabledInversePolarity>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].IPOL, BYTE_LENGTH_ONE)
		return Converter.decodePolarity(buffer)
	}

	static async setPolarity(aBus: I2CAddressedBus, mode: Mode, port: Port, value: Array<EnabledInversePolarity>) {
		const buffer = Converter.encodePolarity(value)
		return aBus.writeI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].IPOL, buffer)
	}

	static async getInterrupt(aBus: I2CAddressedBus, mode: Mode, port: Port): Promise<Array<EnabledInterrupt>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].GPINTEN, BYTE_LENGTH_ONE)
		return Converter.decodeInterrupt(buffer)
	}

	static async setInterrupt(aBus: I2CAddressedBus, mode: Mode, port: Port, value: Array<EnabledInterrupt>) {
		const buffer = Converter.encodeInterrupt(value)
		return aBus.writeI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].GPINTEN, buffer)
	}

	static async getDefaultValue(aBus: I2CAddressedBus, mode: Mode, port: Port): Promise<Array<Digital>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].DEFVAL, BYTE_LENGTH_ONE)
		return Converter.decodeDigital(buffer)
	}

	static async setDefaultValue(aBus: I2CAddressedBus, mode: Mode, port: Port, value: Array<Digital>) {
		const buffer = Converter.encodeDigital(value)
		return aBus.writeI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].DEFVAL, buffer)
	}

	static async getInterruptControl(aBus: I2CAddressedBus, mode: Mode, port: Port): Promise<Array<InterruptControl>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].INTCON, BYTE_LENGTH_ONE)
		return Converter.decodeInterruptControl(buffer)
	}

	static async setInterruptControl(aBus: I2CAddressedBus, mode: Mode, port: Port, value: Array<InterruptControl>) {
		const buffer = Converter.encodeInterruptControl(value)
		return aBus.writeI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].INTCON, buffer)
	}

	static async getPullUp(aBus: I2CAddressedBus, mode: Mode, port: Port): Promise<Array<PullUp>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].GPPU, BYTE_LENGTH_ONE)
		return Converter.decodePullUp(buffer)
	}

	static async setPullUp(aBus: I2CAddressedBus, mode: Mode, port: Port, value: Array<PullUp>) {
		const buffer = Converter.encodePullUp(value)
		return aBus.writeI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].GPPU, buffer)
	}

	static async getInterruptFlag(aBus: I2CAddressedBus, mode: Mode, port: Port): Promise<Array<InterruptFlag>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].INTF, BYTE_LENGTH_ONE)
		return Converter.decodeInterruptFlag(buffer)
	}

	static async getInterruptCaptureValue(aBus: I2CAddressedBus, mode: Mode, port: Port): Promise<Array<Digital>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].INTCAP, BYTE_LENGTH_ONE)
		return Converter.decodeDigital(buffer)
	}

	static async getOutputValue(aBus: I2CAddressedBus, mode: Mode, port: Port): Promise<Array<Digital>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].GPIO, BYTE_LENGTH_ONE)
		return Converter.decodeDigital(buffer)
	}

	static async setOutputValue(aBus: I2CAddressedBus, mode: Mode, port: Port, value: Array<Digital>) {
		const buffer = Converter.encodeDigital(value)
		return aBus.writeI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].GPIO, buffer)
	}

	static async getOutputLatchValue(aBus: I2CAddressedBus, mode: Mode, port: Port): Promise<Array<Digital>> {
		const buffer = await aBus.readI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].OLAT, BYTE_LENGTH_ONE)
		return Converter.decodeDigital(buffer)
	}

	static async setOutputLatchValue(aBus: I2CAddressedBus, mode: Mode, port: Port, value: Array<Digital>) {
		const buffer = Converter.encodeDigital(value)
		return aBus.writeI2cBlock(REGISTERS_BY_BANK_PORT[mode.bank][port].OLAT, buffer)
	}
}
