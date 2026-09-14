// eslint-disable-line import/no-namespace

const IS_HEX_REGEX = /^#([A-Fa-f0-9]{3}){1,2}$/u;

export function isHex(color: string): boolean {
	return IS_HEX_REGEX.test(color);
}
