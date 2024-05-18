import { I2CAddressedBus } from '@johntalton/and-other-delights'

import { CommonDirect } from './direct.js'
import { CommonBank0 } from './bank0.js'
import { CommonSequential } from './sequential.js'
import { CommonBank1Sequential } from './bank1sequential.js'

export class MCP23 {
	#bus: I2CAddressedBus

	static from(bus: I2CAddressedBus) { return new MCP23(bus) }

	constructor(bus: I2CAddressedBus) {
		this.#bus = bus
	}

	// things that can be done in any mode (bank/sequence)
	async getControl(mode) { return CommonDirect.getControl(this.#bus, mode) }
	async setControl(mode, control) { return CommonDirect.setControl(this.#bus, mode, control)}

	async getDirection(mode, port) { return CommonDirect.getDirection(this.#bus, mode, port) }
	async setDirection(mode, port, direction) { return CommonDirect.setDirection(this.#bus, mode, port, direction) }

	async getPolarity(mode, port) { return CommonDirect.getPolarity(this.#bus, mode, port) }
	async setPolarity(mode, port, polarity) { return CommonDirect.setPolarity(this.#bus, mode, port, polarity) }

	async getInterrupt(mode, port) { return CommonDirect.getInterrupt(this.#bus, mode, port) }
	async setInterrupt(mode, port, interrupt) { return CommonDirect.setInterrupt(this.#bus, mode, port, interrupt) }

	async getDefaultValue(mode, port) { return CommonDirect.getDefaultValue(this.#bus, mode, port) }
	async setDefaultValue(mode, port, defaultValue) { return CommonDirect.setDefaultValue(this.#bus, mode, port, defaultValue) }

	async getInterruptControl(mode, port) { return CommonDirect.getInterruptControl(this.#bus, mode, port) }
	async setInterruptControl(mode, port, interruptControl) { return CommonDirect.setInterruptControl(this.#bus, mode, port, interruptControl) }

	async getPullUp(mode, port) { return CommonDirect.getPullUp(this.#bus, mode, port) }
	async setPullUp(mode, port, pullUp) { return CommonDirect.setPullUp(this.#bus, mode, port, pullUp) }

	async getInterruptFlag(mode, port) { return CommonDirect.getInterruptFlag(this.#bus, mode, port) }

	async getInterruptCaptureValue(mode, port) { return CommonDirect.getInterruptCaptureValue(this.#bus, mode, port) }

	async getOutputValue(mode, port) { return CommonDirect.getOutputValue(this.#bus, mode, port) }
	async setOutputValue(mode, port, outputValue) { return CommonDirect.setOutputValue(this.#bus, mode, port, outputValue) }

	async getOutputLatchValue(mode, port) { return CommonDirect.getOutputLatchValue(this.#bus, mode, port) }
	async setOutputLatchValue(mode, port, latchValue) { return CommonDirect.setOutputLatchValue(this.#bus, mode, port, latchValue) }

	// things that can be done in Bank0 and any sequence
	async getDirections(mode) { return CommonBank0.getDirections(this.#bus, mode) }
	async getPolarities(mode) { return CommonBank0.getPolarities(this.#bus, mode) }
	async getInterrupts(mode) { return CommonBank0.getInterrupts(this.#bus, mode) }
	async getDefaultValues(mode) { return CommonBank0.getDefaultValues(this.#bus, mode) }
	async getInterruptControls(mode) { return CommonBank0.getInterruptControls(this.#bus, mode) }
	async getPullUps(mode) { return CommonBank0.getPullUps(this.#bus, mode) }
	async getInterruptFlags(mode) { return CommonBank0.getInterruptFlags(this.#bus, mode) }
	async getInterruptCaptureValues(mode) { return CommonBank0.getInterruptCaptureValues(this.#bus, mode) }
	async getOutputValues(mode) { return CommonBank0.getOutputValues(this.#bus, mode) }
	async getOutputLatchValues(mode) { return CommonBank0.getOutputLatchValues(this.#bus, mode) }

	// things that can be done when sequential is True
	async getPorts(mode) { return CommonSequential.getPorts(this.#bus, mode) }
	async getPort(mode, port) { return CommonSequential.getPort(this.#bus, mode, port) }

	// things that can only be done in Bank1 sequential True
	async setPort(mode, port, options) { return CommonBank1Sequential.setPort(this.#bus, mode, port, options) }
}
