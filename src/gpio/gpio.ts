/* eslint-disable max-classes-per-file */
import { Direction, Edge } from '../types'

export class Gpio {
	#controller
	#pin

	constructor(pin, controller) {
		this.#pin = pin
		this.#controller = controller
	}

	async direction() { return this.#controller.pinDirection(this.#pin) }
	async setDirection(_direction: Direction) { return Promise.reject(Error('setDirection')) }

	async edge() { return Promise.reject(Error('edge')) }
	async setEdge(_edge: Edge) { return Promise.reject(Error('setEdge')) }

	async activeLow() { return Promise.reject(Error('activeLow')) }
	async setActiveLow(_activeLow: boolean) { return Promise.reject(Error('setActiveLow')) }

	async read() { return this.#controller.read(this.#pin) }
	async write(value) { return this.#controller.write(this.#pin, value) }

	async watch(cb) { return this.#controller.watch(this.#pin, cb) }
	async unwatch(_cb) { return Promise.reject(Error('unwatch')) }
}

/**
 *
 **/
export class Port {
	async readUInt8() { }
	async readInt8() { }

	async writeUInt8(_value) { }
	async writeInt8(_value) { }

	async readTransaction() { }
	async writeTransaction() { }
}

/**
 *
 **/
export class Word {
	async readUInt16BE() { }
	async readInt16BE() { }
	async readUInt16LE() { }
	async readInt16LE() { }

	async readTransaction() { }
	async writeTransaction() { }
}
