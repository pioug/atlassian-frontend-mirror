/**
 * Direct copy from adf-schema to kill circular dependency without pulling into
 * a new package
 */

/* eslint-disable no-bitwise */
export const generateUuid = () =>
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
	});
/* eslint-enable no-bitwise */

let staticValue: string | false = false;

export const uuid = {
	setStatic(value: string | false): void {
		staticValue = value;
	},

	generate() {
		return staticValue || generateUuid();
	},
};
