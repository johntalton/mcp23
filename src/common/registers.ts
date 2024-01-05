// data sheet defined register layout for bank0 and bank1

// the total size of all register related to a A or B ports
// from the perspective of configuration and not state.
// that is it does not include the INTCAP or GPIO registers
export const PIN_STATE_SIZE = 8

// when in bank1 the gap between the start of the A register set
//  and the B register set is this wide. (B1.IODIRB - B1.OLATA)
export const BANK1_AB_GAP_SIZE = 5

// bank 0 layout
export const REGISTERS_BANK0 = {
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
export const REGISTERS_BANK1 = {
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

// helpful short hand using bank as an index
export const REGISTERS = [REGISTERS_BANK0, REGISTERS_BANK1]
