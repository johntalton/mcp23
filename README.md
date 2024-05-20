# Microchip I/O Expander

[![npm Version](http://img.shields.io/npm/v/@johntalton/mcp23.svg)](https://www.npmjs.com/package/@johntalton/mcp23)
![GitHub package.json version](https://img.shields.io/github/package-json/v/johntalton/mcp23)
![CI](https://github.com/johntalton/mcp23/workflows/CI/badge.svg)
![GitHub](https://img.shields.io/github/license/johntalton/mcp23)
[![Downloads Per Month](http://img.shields.io/npm/dm/@johntalton/mcp23.svg)](https://www.npmjs.com/package/@johntalton/mcp23)
![GitHub last commit](https://img.shields.io/github/last-commit/johntalton/mcp23)

A Feature rich general I/O chip available in single port (8-bit) and dual port (16-bit) packages.

## Banks and sequential mode

The chip has four operational mode in which registers can be read/written.

- Interlaced Block
- Dual Block
- 8-bit Poll
- 16-bit Poll

The library exposes methods that are specific for each mode, and is the callers responsibility to validate mode settings. This affords reduced call overhead (no validation of mode) when operation are done in a stable mode environment.


