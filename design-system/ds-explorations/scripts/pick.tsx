export const pick: <T extends any>(key: keyof T) => (obj: T) => T[keyof T] =
	<T extends any>(key: keyof T) =>
	(obj: T) =>
		obj[key];
