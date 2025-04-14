import { withProfiling } from '../self-measurements';

/**
 * A random function that passes one in rate times.
 * E.g. coinflip(2) is the same as if you flipped a coin.
 * It will pass 50% of the time
 * @param rate The change that it will pass (1 in <rate> times)
 * @returns bool, if it passes or not
 */
const coinflip = withProfiling(function coinflip(rate: number): boolean {
	if (rate === 0) {
		return false;
	} else if (rate === 1) {
		return true;
	} else {
		return Math.random() * rate <= 1;
	}
});

export default coinflip;
