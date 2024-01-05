/* eslint-disable fp/no-mutating-methods */
import { Util } from './util.js'

export class ConsoleUtil {
	static logProfile(profile) {
		return console.log(ConsoleUtil.profileToString(profile))
	}

	static logState(state) {
		return console.log(ConsoleUtil.stateToString(state))
	}

	static logGpio(gpio) {
		return console.log(ConsoleUtil.gpioToString(gpio))
	}


	static profileToString(profile) {
		const slewStr = profile.slew ? 'true' : 'false (slow-mode)'
		const intStr = (profile.interrupt.mirror ? 'mirrored' : '') + profile.interrupt.mode
		return 'Operational Mode: ' + profile.mode + '\n' +
			' slew: ' + slewStr + ' / hw addressing: ' + profile.hardwareAddress + '\n' +
			' interrupt ' + intStr
	}

	static stateToString(state) {
		const skipDefaults = true // todo move out

		const profileStr = ConsoleUtil.profileToString(state.profile) + '\n'
		return state.gpios.reduce((acc, gpio) => {
			if (skipDefaults && Util.isDefaultGpio(gpio)) { return acc }
			return acc + ConsoleUtil.gpioToString(gpio) + '\n'
		}, profileStr)
	}

	static gpioToString(gpio) {
		const dirIn = gpio.direction === 'in'

		return `
			${dirIn ? '⇠ Input' : '⇢ Output'} Port: ${gpio.port} Pin: ${gpio.pin} ${dirIn ? `Edge: ${gpio.edge}` : ''}
			${dirIn && gpio.pendingInterrupt ? '🔔 pending interrupt' : ''}
				active-low: ${gpio.activeLow}
				pull-up: ${gpio.pullUp ? 'enabled 100 kΩ' : 'disabled'}
				output latch: ${gpio.outputLatch}
		`
	}
}
