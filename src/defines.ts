export type Bank = 0 | 1

export type Mode = {
	bank: Bank,
	sequential: boolean
}

export type Port = 'A' | 'B'

export type Direction = 0 | 1

export type EnabledInversePolarity =  Boolean
export type EnabledInterrupt =  Boolean
export type Digital = 0 | 1
export type InterruptControl =  0 | 1
export type PullUp =  Boolean
export type InterruptFlag = Boolean

export type Control = {}

// ---

export const HIGH: Digital = 1
export const LOW: Digital = 0

export const BANK_0: Bank = 0
export const BANK_1: Bank = 1

export const PORT: { [key: string]: Port }  = {
	A: 'A',
	B: 'B'
}
export const DIRECTION: { [key: string]: Direction } = {
	IN: 1,
	OUT: 0
}

export const INTERRUPT_CONTROL: { [key: string]: InterruptControl }  = {
	DEFAULT_VALUE: 1,
	PREVIOUS_VALUE: 0
}

export const MODE = {
	POLL_8_BIT: { bank: BANK_1, sequential: false },
	POLL_16_BIT: { bank: BANK_0, sequential: false },
	DUAL_BLOCK: { bank: BANK_1, sequential: true },
	INTERLACED_BLOCK: { bank: BANK_0, sequential: true }
}

// bank 0 layout
export const REGISTERS_BANK_0 = {
	IODIRA: 0x00,
	IODIRB: 0x01,
	IPOLA: 0x02,
	IPOLB: 0x03,
	GPINTENA: 0x04,
	GPINTENB: 0x05,
	DEFVALA: 0x06,
	DEFVALB: 0x07,
	INTCONA: 0x08,
	INTCONB: 0x09,
	IOCON: 0x0A,
	IOCON_ALT: 0x0B,
	GPPUA: 0x0C,
	GPPUB: 0x0D,
	INTFA: 0x0E,
	INTFB: 0x0F,
	INTCAPA: 0x10,
	INTCAPB: 0x11,
	GPIOA: 0x12,
	GPIOB: 0x13,
	OLATA: 0x14,
	OLATB: 0x15
}

// bank 1 layout
export const REGISTERS_BANK_1 = {
	IODIRA: 0x00,
	IPOLA: 0x01,
	GPINTENA: 0x02,
	DEFVALA: 0x03,
	INTCONA: 0x04,
	IOCON: 0x05,
	GPPUA: 0x06,
	INTFA: 0x07,
	INTCAPA: 0x08,
	GPIOA: 0x09,
	OLATA: 0x0A,

	IODIRB: 0x10,
	IPOLB: 0x11,
	GPINTENB: 0x12,
	DEFVALB: 0x13,
	INTCONB: 0x14,
	IOCON_ALT: 0x15,
	GPPUB: 0x16,
	INTFB: 0x17,
	INTCAPB: 0x18,
	GPIOB: 0x19,
	OLATB: 0x1A
}






// export const BIT_SET = 1
// export const BIT_UNSET = 0

// export const MIR_EN = BIT_SET
// export const SEQ_EN = BIT_UNSET
// export const SLEW_EN = BIT_UNSET
// export const HWA_EN = BIT_SET
// export const ODR_OPENDRAIN = BIT_SET
// export const POL_ACTIVELOW = BIT_UNSET

// function NOT_BIT(bit: number) { return bit === BIT_SET ? BIT_UNSET : BIT_SET }

// export const MIR_DEN = NOT_BIT(MIR_EN)
// export const SEQ_DEN = NOT_BIT(SEQ_EN)
// export const SLEW_DEN = NOT_BIT(SLEW_EN)
// export const HWA_DEN = NOT_BIT(HWA_EN)
// export const ODR_ACTIVEDRIVER = NOT_BIT(ODR_OPENDRAIN)
// export const POL_ACTIVEHIGH = NOT_BIT(POL_ACTIVELOW)

// export const DEFAULT_MIR = MIR_DEN
// export const DEFAULT_SEQ = SEQ_EN
// export const DEFAULT_SLEW = SLEW_EN
// export const DEFAULT_HWA = HWA_DEN
// export const DEFAULT_ODR = ODR_ACTIVEDRIVER
// export const DEFAULT_POL = POL_ACTIVELOW