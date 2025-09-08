# Microchip I/O Expander

A Feature rich general I/O chip available in single port (8-bit) and dual port (16-bit) packages.

[![npm Version](http://img.shields.io/npm/v/@johntalton/mcp23.svg)](https://www.npmjs.com/package/@johntalton/mcp23)
![GitHub package.json version](https://img.shields.io/github/package-json/v/johntalton/mcp23)
[![CI](https://github.com/johntalton/mcp23/actions/workflows/CI.yaml/badge.svg)](https://github.com/johntalton/mcp23/actions/workflows/CI.yaml)

## Banks and sequential mode

The chip has four operational mode in which registers can be read/written.

- Interlaced Block
- Dual Block
- 8-bit Poll
- 16-bit Poll

The library exposes methods that are specific for each mode, and is the callers responsibility to validate mode settings. This affords reduced call overhead (no validation of mode) when operation are done in a stable mode environment.


# Example

```javascript
import { I2CAddressedBus } from '@johntalton/and-other-delights'
import { MCP23, MODE, PORT, DIRECTION } form '@johntalton/mcp23'

const bus = /* I2CBus implementation of your choice */
const aBus = new I2CAddressedBus(bus, 0x20)
const device = new MCP23(aBus)

const mode = MODE.DUAL_BLOCK // bank: 1, sequential: true
const port = PORT.A
const direction = await device.getDirection(mode, port)

// test if portA pin 0 is an Output
const isA0Output = direction[0] === DIRECTION.OUT


```
```javascript
// ...
// some things can only be done in specific modes
// first switch to that mode from the existing mode
const existingIOControl = await device.getControl(existingMode)
const newMode = MODE.POLL_16_BIT

await device.setControl(existingMode, {
  ...existingIOControl,
  mode: newMode
})

// existingMode is now invalid, and the device is in the newMode
// now polling 16 bit register can be done efficiently
const flags = await device.getInterruptFlags(newMode)


```