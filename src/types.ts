export type Bank = 0 | 1

export type Mode = {
	bank: Bank,
	sequential: boolean
}

// GPIO
export type Direction = 'in' | 'out' | 'high' | 'low'
export type Edge = 'none' | 'rising' | 'falling' | 'both'
