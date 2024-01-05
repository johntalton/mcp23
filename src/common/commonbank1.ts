import { I2CAddressedTransactionBus } from '@johntalton/and-other-delights'

import { CommonBank } from './commonbank.js'

/**
 *
 **/
export class CommonBank1 extends CommonBank {
	static async readAB(bus: I2CAddressedTransactionBus, registerA, registerB) {
		return bus.transaction(async tbus => {
			const A = await tbus.readI2cBlock(registerA, 1)
			const B = await tbus.readI2cBlock(registerB, 1)

			const a8 = new Uint8Array(A)
			const b8 = new Uint8Array(B)

			const c8 = new Uint8Array(2)
			c8.set(a8, 0)
			c8.set(b8, 1)

			return c8.buffer
		})
	}
}
