export const generateUuid = (): string =>
	// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
	'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/gu, (c) => {
		const r = (Math.random() * 16) | 0;
		return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
	});

let staticValue: string | false = false;

export const uuid = {
	setStatic(value: string | false): void {
		staticValue = value;
	},

	generate(): string {
		return staticValue || generateUuid();
	},
};
