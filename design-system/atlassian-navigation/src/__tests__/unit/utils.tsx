import { stripEmptyProperties } from '../../utils';

describe('stripEmptyProperties', () => {
	it('should return an object with only non-empty properties', () => {
		const input = { a: 1, b: 0, c: 'test', d: null, e: undefined, f: false, g: '' };

		const output = stripEmptyProperties(input);

		expect(output).toEqual({ a: 1, b: 0, c: 'test', f: false });
	});

	it('should return an empty object if all properties are empty', () => {
		const input = { a: null, b: undefined, c: '' };

		const output = stripEmptyProperties(input);

		expect(output).toEqual({});
	});

	it('should return an empty object if the input object is empty', () => {
		const input = {};

		const output = stripEmptyProperties(input);

		expect(output).toEqual({});
	});

	it('should not mutate the input object', () => {
		const input = { a: 1, b: 0 };
		const copy = { ...input };

		const output = stripEmptyProperties(input);

		// Assert referential inequality.
		expect(output).not.toBe(input);
		// Assert the values are the same.
		expect(input).toEqual(copy);
	});
});
