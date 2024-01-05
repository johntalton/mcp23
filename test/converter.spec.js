import { describe, it } from 'mocha'
import { expect } from 'chai'

import { Converter, Edges, InterruptMode, ProfileMode } from '@johntalton/mcp23'

describe('Converter', () => {
	describe('toState', () => {
		it('empty', () => {
			const gpio = []
			const pinmap = {}
			const state = Converter.toState(gpio, pinmap)
			expect(state).to.deep.equal({
				a: {
					defval: 0,
					gpinten: 0,
					gppu: 0,
					intcon: 0,
					iodir: 255,
					iopol: 0,
					olat: 0
				},
				b: {
					defval: 0,
					gpinten: 0,
					gppu: 0,
					intcon: 0,
					iodir: 255,
					iopol: 0,
					olat: 0
				}
			})
		})
	})

	describe('toPortState', () => {
		it('empty', () => {
			const gpios = []
			const portPinmap = {}
			const ps = Converter.toPortState(gpios, portPinmap)
			expect(ps).to.deep.equal({
				defval: 0,
				gpinten: 0,
				gppu: 0,
				intcon: 0,
				iodir: 255,
				iopol: 0,
				olat: 0
			})
		})
	})

	describe('toGpioInterrupt', () => {
		it('empty', () => {
			const edge = Edges.BOTH
			const gi = Converter.toGpioInterrupt(edge)
			expect(gi).to.deep.equal([
				0, 0, 0
			])
		})
	})

	describe('toIocon', () => {
		it('empty', () => {
			const profile = {
				mode: ProfileMode.MODE_INTERLACED_BLOCK,
				interrupt: {
					mode: InterruptMode.INT_OPEN_DRAIN,
					mirror: true
				},
				slew: true,
				hardwareAddress: true
			}
			const ioc = Converter.toIocon(profile)
			expect(ioc).to.equal(0b01001100)
		})
	})

	describe('toIoconInterrupt', () => {
		it('empty', () => {
			const mode = InterruptMode.INT_OPEN_DRAIN
			const ii = Converter.toIoconInterrupt(mode)
			expect(ii).to.deep.equal([
				1, 0
			])
		})
	})

	describe('toIoconMode', () => {
		it('empty', () => {
			const mode = ProfileMode.MODE_INTERLACED_BLOCK
			const im = Converter.toIoconMode(mode)
			expect(im).to.deep.equal({
				bank: 0,
				sequential: true
			})
		})
	})

	//  --------------------------------

	describe('fromPortState', () => {
		it('', () => {
			expect()
		})
	})

	describe('fromGpioInterrupt', () => {
		it('', () => {
			expect()
		})
	})

	describe('fromIocon', () => {
		it('', () => {
			expect()
		})
	})

	describe('fromIoconInterrupt', () => {
		it('', () => {
			expect()
		})
	})

	describe('fromIoconMode', () => {
		it('', () => {
			expect()
		})
	})

	describe('fromData', () => {
		it('', () => {
			expect()
		})
	})
})
