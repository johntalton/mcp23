/* eslint-disable max-classes-per-file */

import { Bank, Direction, Edge, Mode } from './types.js'

export const Banks: { [key: string]: Bank } = {
	BANK0: 0, // ABAB
	BANK1: 1 // AA BB
}

export function matchCommonMode(one: Mode, two: Mode) {
	if (one.bank !== two.bank) { return false }
	if (one.sequential !== two.sequential) { return false }
	return true
}

// theses follow similarly to the ones defined
// in the converter, but should not be confused.
// can also be called common modes. as they are the
//  terms in which the `Common` defines the word mode
// of course they provide similar functionality here.
export const CommonMode: { [key: string]: Mode} = {
	MODE_MAP_8BIT_POLL: { bank: Banks.BANK1, sequential: false },
	MODE_MAP_16BIT_POLL: { bank: Banks.BANK0, sequential: false },
	MODE_MAP_DUAL_BLOCKS: { bank: Banks.BANK1, sequential: true },
	MODE_MAP_INTERLACED_BLOCK: { bank: Banks.BANK0, sequential: true }
}

// mode defined by chip as reset mode (exported bellow)
export const COMMON_MODE_MAP_DEFAULT = CommonMode.MODE_MAP_INTERLACED_BLOCK

// ------------------------------------

export const DigitalIO: { [key: string]: number } = {
	HIGH: 1,
	LOW: 0
}

export const ProfileMode: { [key: string]: string } = {
	MODE_8BIT_POLL: '8bit-poll',
	MODE_16BIT_POLL: '16bit-poll', // AB Wobble
	MODE_DUAL_BLOCKS: 'dual-blocks',
	MODE_INTERLACED_BLOCK: 'interlaced-block' // default
}

export const InterruptMode: { [key: string]: string } = {
	INT_ACTIVE_LOW: 'active-low',
	INT_ACTIVE_HIGH: 'active-high',
	INT_OPEN_DRAIN: 'open-drain'
}

export const Directions: { [key: string]: Direction } = {
	IN: 'in',
	OUT: 'out',
	OUT_HIGH: 'high',
	OUT_LOW: 'low'
}

export const Edges: { [key: string]: Edge } = {
	EDGE_NONE: 'none',
	EDGE_RISING: 'rising',
	EDGE_FALLING: 'falling',
	EDGE_BOTH: 'both'
}
