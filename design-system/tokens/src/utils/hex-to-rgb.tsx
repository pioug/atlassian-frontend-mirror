import { isValidHex } from './is-valid-hex';

export function hexToRgb(hex: string): [number, number, number] {
	if (!isValidHex(hex)) {
		throw new Error('Invalid HEX');
	}
	let c: any;
	c = hex.substring(1).split('');
	if (c.length === 3) {
		c = [c[0], c[0], c[1], c[1], c[2], c[2]];
	}
	c = '0x' + c.join('');
	return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
}
