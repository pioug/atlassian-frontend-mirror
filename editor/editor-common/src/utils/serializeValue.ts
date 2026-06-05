export const serializeValue = <T>(
	value: T[keyof T],
):
	| string
	| (T[keyof T] & {})
	| {
			type: string;
			keys: string[];
	  }
	| undefined => {
	const valueType = typeof value;
	if (value === null) {
		return 'null';
	} else if (value === undefined) {
		return 'undefined';
	} else if (valueType === 'string' || valueType === 'number') {
		return value;
	} else if (valueType === 'symbol') {
		return (value as unknown as symbol).toString();
	}
	// Calling toString of function returns whole function text with body.
	// So, just return function with name.
	else if (valueType === 'function') {
		return `function:${(value as unknown as Function).name}`;
	} else if (valueType === 'object') {
		return {
			type: 'object',
			keys: Object.keys(value),
		};
	}
};
