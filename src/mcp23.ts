import { I2CAddressedBus } from '@johntalton/and-other-delights'

import { CommonDirect } from './direct.js'
import { CommonBank0 } from './bank0.js'
import { CommonBank0Sequential } from './bank0sequential.js'
import { CommonBank1Sequential } from './bank1sequential.js'
import { Direction, Mode, Port } from './defines.js'

export class MCP23 {
	#bus: I2CAddressedBus

	static from(bus: I2CAddressedBus) { return new MCP23(bus) }

	constructor(bus: I2CAddressedBus) {
		this.#bus = bus
	}

	// things that can be done in any mode (bank/sequence)
	async getControl(mode: Mode) { return CommonDirect.getControl(this.#bus, mode) }
	async setControl(mode: Mode, control) { return CommonDirect.setControl(this.#bus, mode, control)}

	async getDirection(mode: Mode, port: Port) { return CommonDirect.getDirection(this.#bus, mode, port) }
	async setDirection(mode: Mode, port: Port, direction: Array<Direction>) { return CommonDirect.setDirection(this.#bus, mode, port, direction) }

	async getPolarity(mode: Mode, port: Port) { return CommonDirect.getPolarity(this.#bus, mode, port) }
	async setPolarity(mode: Mode, port: Port, polarity) { return CommonDirect.setPolarity(this.#bus, mode, port, polarity) }

	async getInterrupt(mode: Mode, port: Port) { return CommonDirect.getInterrupt(this.#bus, mode, port) }
	async setInterrupt(mode: Mode, port: Port, interrupt) { return CommonDirect.setInterrupt(this.#bus, mode, port, interrupt) }

	async getDefaultValue(mode: Mode, port: Port) { return CommonDirect.getDefaultValue(this.#bus, mode, port) }
	async setDefaultValue(mode: Mode, port: Port, defaultValue) { return CommonDirect.setDefaultValue(this.#bus, mode, port, defaultValue) }

	async getInterruptControl(mode: Mode, port: Port) { return CommonDirect.getInterruptControl(this.#bus, mode, port) }
	async setInterruptControl(mode: Mode, port: Port, interruptControl) { return CommonDirect.setInterruptControl(this.#bus, mode, port, interruptControl) }

	async getPullUp(mode: Mode, port: Port) { return CommonDirect.getPullUp(this.#bus, mode, port) }
	async setPullUp(mode: Mode, port: Port, pullUp) { return CommonDirect.setPullUp(this.#bus, mode, port, pullUp) }

	async getInterruptFlag(mode: Mode, port: Port) { return CommonDirect.getInterruptFlag(this.#bus, mode, port) }

	async getInterruptCaptureValue(mode: Mode, port: Port) { return CommonDirect.getInterruptCaptureValue(this.#bus, mode, port) }

	async getOutputValue(mode: Mode, port: Port) { return CommonDirect.getOutputValue(this.#bus, mode, port) }
	async setOutputValue(mode: Mode, port: Port, outputValue) { return CommonDirect.setOutputValue(this.#bus, mode, port, outputValue) }

	async getOutputLatchValue(mode: Mode, port: Port) { return CommonDirect.getOutputLatchValue(this.#bus, mode, port) }
	async setOutputLatchValue(mode: Mode, port: Port, latchValue) { return CommonDirect.setOutputLatchValue(this.#bus, mode, port, latchValue) }

	// things that can be done in Bank 0 and any sequence
	async getDirections(mode: Mode) { return CommonBank0.getDirections(this.#bus, mode) }
	async getPolarities(mode: Mode) { return CommonBank0.getPolarities(this.#bus, mode) }
	async getInterrupts(mode: Mode) { return CommonBank0.getInterrupts(this.#bus, mode) }
	async getDefaultValues(mode: Mode) { return CommonBank0.getDefaultValues(this.#bus, mode) }
	async getInterruptControls(mode: Mode) { return CommonBank0.getInterruptControls(this.#bus, mode) }
	async getPullUps(mode: Mode) { return CommonBank0.getPullUps(this.#bus, mode) }
	async getInterruptFlags(mode: Mode) { return CommonBank0.getInterruptFlags(this.#bus, mode) }
	async getInterruptCaptureValues(mode: Mode) { return CommonBank0.getInterruptCaptureValues(this.#bus, mode) }
	async getOutputValues(mode: Mode) { return CommonBank0.getOutputValues(this.#bus, mode) }
	async getOutputLatchValues(mode: Mode) { return CommonBank0.getOutputLatchValues(this.#bus, mode) }

	// things that can be done in Bank 0 when sequential is True
	async getPorts(mode: Mode) { return CommonBank0Sequential.getPorts(this.#bus, mode) }

	//  things that can be done in Bank 1 sequential is True
	async getPort(mode: Mode, port: Port) { return CommonBank1Sequential.getPort(this.#bus, mode, port) }
}
