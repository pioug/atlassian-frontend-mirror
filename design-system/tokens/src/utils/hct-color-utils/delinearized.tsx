import * as mathUtils from './math-utils';

/**
 * Delinearizes an RGB component.
 *
 * @param rgbComponent 0.0 <= rgb_component <= 100.0, represents
 * linear R/G/B channel
 * @return 0 <= output <= 255, color channel converted to regular
 * RGB space
 */
export function delinearized(rgbComponent: number): number {
	const normalized = rgbComponent / 100.0;
	let delinearized = 0.0;
	if (normalized <= 0.0031308) {
		delinearized = normalized * 12.92;
	} else {
		delinearized = 1.055 * Math.pow(normalized, 1.0 / 2.4) - 0.055;
	}
	return mathUtils.clampInt(0, 255, Math.round(delinearized * 255.0));
}
