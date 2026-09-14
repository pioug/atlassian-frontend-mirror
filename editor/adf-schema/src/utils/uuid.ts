export const generateUuid = (): string =>
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
