export const isUndefined = (value: any): boolean => value === undefined;

export const pick = (
	obj?: Object,
	keys: Array<string> = [],
): {
	[k: string]: any;
} => {
	if (obj === undefined) {
		return {};
	}
	return Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)));
};

export const omitBy = (
	obj: Object,
	predicate: Function,
): {
	[k: string]: any;
} => Object.fromEntries(Object.entries(obj).filter(([, v]) => !predicate(v)));

export const debounce = (func: Function, wait: number) => {
	let timeout: NodeJS.Timeout;

	return (...args: any[]): void => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
};

export const matches = (srcObj: Object) => {
	return (obj: Object): boolean => {
		let key: keyof typeof srcObj;
		for (key in srcObj) {
			if (obj[key] === undefined || obj[key] !== srcObj[key]) {
				return false;
			}
		}
		return true;
	};
};

function getRandomHexValues(byte: number) {
	return [...Array(byte * 2)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function getRandomHex(byte: number): string {
	let randomHex;
	if (window?.crypto) {
		try {
			randomHex = Array.from(window.crypto.getRandomValues(new Uint8Array(byte)))
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('');
		} catch (e) {
			randomHex = getRandomHexValues(byte);
		}
	} else {
		randomHex = getRandomHexValues(byte);
	}

	return randomHex;
}

export function getRandomTelemetryId(): string {
	return getRandomHex(8);
}
