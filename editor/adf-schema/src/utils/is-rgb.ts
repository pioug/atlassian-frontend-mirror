// eslint-disable-line import/no-namespace

const IS_RGB_REGEX = /rgba?\(/u;

export function isRgb(color: string): boolean {
	return IS_RGB_REGEX.test(color);
}
