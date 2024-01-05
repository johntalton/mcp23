import { I2CAddressedBus } from '@johntalton/and-other-delights'

import { CommonBank } from './commonbank.js'

export const WORD_SIZE = 2

/**
 *
 **/
export class CommonBank0 extends CommonBank {
	static async readAB(bus: I2CAddressedBus, registerA, _registerB) {
		// its your lucky day: all that API just to get this optimization!
		return bus.readI2cBlock(registerA, WORD_SIZE)
	}
}
