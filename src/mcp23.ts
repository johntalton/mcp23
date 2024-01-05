import { I2CAddressedTransactionBus } from '@johntalton/and-other-delights'

import { Mcp23Cached } from './mcp23cached.js'

/**
 * Wrapper for basic API support around the chip.
 *
 * This does not provide any application interface (like gpio)
 * or others.  It does serve as the core set of functionally
 * exposed by the chip.  Other applications should build
 * on top of this.
 *
 * Such as the `mcp23gpio` application (a common use case).
 **/
export class MCP23 extends Mcp23Cached {
	static from(bus: I2CAddressedTransactionBus, options) { return new MCP23(bus, options) }

	// eslint-disable-next-line no-useless-constructor
	constructor(bus: I2CAddressedTransactionBus, options) {
		super(bus, options)
	}
}
