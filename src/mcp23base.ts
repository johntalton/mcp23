import { I2CAddressedTransactionBus } from '@johntalton/and-other-delights'

// eslint-disable-next-line import/no-internal-modules
import { Common } from './common/index.js'
import { Converter } from './converter.js'
import { DEFAULT_NAMES } from './names.js'
import { matchCommonMode } from './defines.js'

/**
 * Base for bus and options, pin names resolve here.
 **/
export class Mcp23Base {
	#bus: I2CAddressedTransactionBus
	#pinmap

	constructor(bus: I2CAddressedTransactionBus, options) {
		const opts = options !== undefined ? options : {}
		this.#bus = bus
		this.#pinmap = opts.names !== undefined ? opts.names : DEFAULT_NAMES
	}

	async close() {
		// Detach from bus. No close needed.
	}

	async softwareReset() { return Common.softwareReset(this.#bus) }

	async sniffMode(hint) {
		const guess = await Common.sniffMode(this.#bus, hint)
		return Converter.fromIoconMode(guess.bank, guess.sequential)
	}

	// note that the mode need to be passed here as the
	// profile may be trying to switch it etc.
	async setProfile(mode, profile) {
		console.log('setProfile', mode, profile)
		return Common.setProfile(this.#bus, mode, Converter.toIocon(profile))
	}

	async profile(mode) {
		const profile = await Common.profile(this.#bus, mode)
		return Converter.fromIocon(profile)
	}

	async state(mode) {
		const state = await Common.state(this.#bus, mode)
		const profile = Converter.fromIocon(state.iocon)

		const pcm = Converter.toIoconMode(profile.mode)
		if(!matchCommonMode(pcm, mode)) {
			console.log('read profiles bank is not the bank used to read!', profile.mode, mode)
		}

		//
		return {
			profile: profile,
			gpios: [
				...Converter.fromPortState(state.a, this.#pinmap.portA),
				...Converter.fromPortState(state.b, this.#pinmap.portB)
			]
		}
	}

	async exportAll(mode, gpios) {
		const state = Converter.toState(gpios, this.#pinmap)
		return Common.exportAll(this.#bus, mode, state)
	}

	async bulkData(mode) {
		const data = await Common.bulkData(this.#bus, mode)
		return Converter.fromData(data, this.#pinmap)
	}
}
