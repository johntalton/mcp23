/**
 * Gpio Application Interface.
 *
 * This defines - on top of - a gpio like interface to interact
 *  with the basic chip.
 *
 * While this class will be the go-to for most -
 *  it adds a significant amount of assumed logic that is not
 *  inherently part of the chips API. As such use of Mcp23
 *  class directly may be preferred at times.
 **/
import { I2CAddressedBus } from '@johntalton/and-other-delights'

import { Common } from '../common.js'
import { Converter } from '../converter.js'
import { Mcp23GpioCached } from './mcp23gpiocached.js'
import { Gpio } from './gpio.js'


const EVENT_CHANGE = 'change'

/**
 *
 **/
class Mcp23Gpio extends Mcp23GpioCached {
	static from(bus: I2CAddressedBus, options) {
		return Promise.resolve(new Mcp23Gpio(bus, options))
	}

	// eslint-disable-next-line no-useless-constructor
	constructor(bus, options) {
		super(bus, options)
		// this.emit = new EventEmitter();
	}

	// ----------------------------

	// we assume the calling library has handled checking
	//  for errors and handling and any configuration to satisfy
	//  the condition that this only be called when a
	//  new interrupt has been singled by the chip.
	//  it does not get called on falling / cleared.
	//  nor should it be called multiple time, please
	interruptA() {
		console.log('mcp23gpio Handle Interrupt A ----------------------------')
		return this.commonReadAndProcessA()
	}

	interruptB() {
		console.log('mcp23gpio Handle Interrupt B ----------------------------')
		return Promise.resolve()
	}

	// ----------------------------

	commonReadAndProcessA() {
		// for each port, the interrupts first pin that
		// caused the an interrupt will be the one set in the
		// interrupt flags register.
		// other value changes may exist on the chip within that
		// same port (or another port if interrupt mirroring is on)
		// further, the different chips use slightly different
		// interrupt clear register combinations
		// at this level (disregarding mode) we do not assume
		// any type of cached value, this includes assuming the
		// configured state of each pin
		return Common.readIntfA(this.bus, this.commonMode)
			.then(intf => {
				// NOTE reading IntCap will cause interrupt clear
				//
				return Common.readIntcapA(this.bus, this.commonMode)
					.then(intcap => {
						const pins = Converter.bitFlagToPinSet(intf, this.pinmap.portA)
						const values = Converter.bitFlagToPinSet(intcap, this.pinmap.portA)

						console.log('common Read and Process A', pins, values)
						return Promise.all(pins
							.map((pin, index) => ({ ...pin, value: Converter.toHighLow(values[index].set) }))
							.filter(pin => pin.set)
							.map(pin => this.emitPinChange(null, pin.pin, pin.value)))
					})
			})
	}

	emitPinChange(err, pin, value) {
		console.log('emit pin change', err, pin, value)

		// we could have used the pin name as part of the name
		//  here and that would have eliminated the need for the
		//  `filter` inside of the watch function setup. This
		//  might limit some assumption about future capabilities
		this.emit.emit(EVENT_CHANGE, err, pin, value)
		return Promise.resolve()
	}

	// ----------------------------

	exportGpio(gpio) {
		return Promise.reject(Error('no short hand methods yet'))
	}

	exportGpioFromExisting(gpio) {
		return Promise.resolve(new Gpio(gpio.pin, this))
	}

	watch(pin, cb) { // eslint-disable-line promise/prefer-await-to-callbacks
		console.log('watching pin', pin)
		function filtered(filterPin, fcb) {
			return (err, incommingPin, value) => {
				if (incommingPin !== filterPin) { console.log('filtering pin', incommingPin, filterPin); return } // suppress
				console.log('this pin change event was for me, and now we call your callback')
				fcb(err, value)
			};
		}

		this.emit.on(EVENT_CHANGE, filtered(pin, cb))

		return Promise.resolve()
	}

	read(pin) {
		console.log('mcp23gpio read', pin)

		// todo, we could create a cache of the last
		//  gpioAB registers if we assumed that intAB
		//  are configured properly to support that
		//  where does this code live however, as we
		//  don't want to make it part of core interface

		return this.commonReadAndProcessA()

			// force a direct read
			.then(() => Common.readGpioA(this.bus, this.commonMode))
			// return Common.readGpioA(this.bus, this.commonMode)
			.then(gpioa => {
				const values = Converter.bitFlagToPinSet(gpioa, this.pinmap.portA)
				console.log('values for all portA gpio', gpioa, values)
				const result = values.find(value => value.pin === pin)
				if (result === undefined) { throw new Error('unknown pin name: ' + pin) }
				console.log('mcp23gpio read result', result)
				return Converter.toHighLow(result.set)
			})
	}

	write(pin, value) {
		console.log('mcp23gpio write', pin, value)
		// is this a port A or B write
		//
		// writing a single pin (digital write ins some parlance)
		//  we must write the entire registers worth of data
		//  as such we must know/assume existing values if we
		//  do not wish to have side effects of single pin action
		//
		return Common.readGpioA(this.bus, this.commonMode)
			.then(currentGpio => Converter.calculateNewPinValue(currentGpio, pin, value, this.pinmap.portA))
			.then(newGpio => Common.writeGpioA(this.bus, this.commonMode, newGpio))
	}
}

module.exports = { Mcp23Gpio }
