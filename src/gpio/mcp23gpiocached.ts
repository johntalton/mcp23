import { Mcp23Cached } from '../mcp23cached.js'

/**
 * Caching parts of the gpio state in order to provide
 * a layer of interrupt handling required because of the
 * binary state of the INT A/B registers.
 *
 * Also discussed [here](https://github.com/torvalds/linux/blob/2837461dbe6f4a9acc0d86f88825888109211c99/drivers/pinctrl/pinctrl-mcp23s08.c#L496)
 **/
export class Mcp23GpioCached extends Mcp23Cached {
	// if cached values mismatch read, check read for initial, emit `reset` event.
}
