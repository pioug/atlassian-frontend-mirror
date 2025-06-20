import { parseHex } from '../../formats/hex';

describe('parseHex()', () => {
	const consoleError = jest.spyOn(console, 'error');
	beforeEach(() => {
		// Intention of this is to avoid suppressing an unexpected console error
		consoleError.mockReset();
	});

	describe('invalid input', () => {
		beforeEach(() => {
			consoleError.mockImplementation(() => {});
		});

		const { NODE_ENV } = process.env;

		it('should log an error in development environments', () => {
			process.env.NODE_ENV = 'development';

			parseHex('a#123');

			expect(consoleError).toHaveBeenCalledTimes(1);
			expect(consoleError.mock.lastCall).toMatchInlineSnapshot(`
			[
			  "parseHex failed to parse input: 'a#123'",
			]
		`);

			process.env.NODE_ENV = NODE_ENV;
		});

		it('should not log an error in prod environments', () => {
			process.env.NODE_ENV = 'production';

			parseHex('a#123');

			expect(consoleError).not.toHaveBeenCalled();

			process.env.NODE_ENV = NODE_ENV;
		});

		describe('should return null', () => {
			test.each([
				{ value: '#12', description: 'invalid length (2 characters)' },
				{ value: '#12345', description: 'invalid length (5 characters)' },
				{ value: '#1234567', description: 'invalid length (7 characters)' },
				{ value: '#123456789', description: 'invalid length (9 characters)' },
				{ value: 'a#123', description: 'invalid character at start' },
				{ value: '#123g', description: 'invalid character at end' },
			])('$description', ({ value }) => {
				expect(parseHex(value)).toBeNull();
			});
		});
	});

	/**
	 * For clarity, the tests below have been written with both:
	 *
	 * - hex literals
	 * - decimal literals
	 *
	 * The hex literals explicitly show how the parsing works,
	 * and provide a free level of assurance our test is correct.
	 * The hex literal values can be quickly derived from the input string.
	 *
	 * The decimal literals provide clarity on what numbers the
	 * hex literals actually correspond to.
	 */

	it('should parse a hex value with 3 digits', () => {
		// Each hex digit 'X' is treated as 'XX' for the shorthand syntax
		const result = parseHex('#A24');
		expect(result).toEqual({
			r: 0xaa, // The first hex digit in the input string, but twice
			g: 0x22, // The second hex digit in the input string, but twice
			b: 0x44, // The third hex digit in the input string, but twice
		});
		expect(result).toEqual({
			r: 170,
			g: 34,
			b: 68,
		});
	});

	it('should parse a hex value with 4 digits', () => {
		// Each hex digit 'X' is treated as 'XX' for the shorthand syntax
		// The alpha channel ('E') will be ignored
		const result = parseHex('#fAcE');
		expect(result).toEqual({
			r: 0xff, // The first hex digit in the input string, but twice
			g: 0xaa, // The second hex digit in the input string, but twice
			b: 0xcc, // The third hex digit in the input string, but twice
		});
		expect(result).toEqual({
			r: 255,
			g: 170,
			b: 204,
		});
	});

	it('should parse a hex value with 6 digits', () => {
		// Each pair of two hex digits corresponds to a full channel value for the longhand syntax
		const result = parseHex('#123456');
		expect(result).toEqual({
			r: 0x12, // The first pair of hex digits in the input string
			g: 0x34, // The second pair of hex digits in the input string
			b: 0x56, // The third pair of hex digits in the input string
		});
		expect(result).toEqual({
			r: 18,
			g: 52,
			b: 86,
		});
	});

	it('should parse a hex value with 8 digits', () => {
		// Each two hex digits corresponds to a full channel value for the longhand syntax
		// The alpha channel ('1A') will be ignored
		const result = parseHex('#F0CACC1A');
		expect(result).toEqual({
			r: 0xf0, // The first pair of hex digits in the input string
			g: 0xca, // The second pair of hex digits in the input string
			b: 0xcc, // The third pair of hex digits in the input string
		});
		expect(result).toEqual({
			r: 240,
			g: 202,
			b: 204,
		});
	});
});
