import { parseHsl } from '../../formats/hsl';

describe('parseHsl', () => {
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

			parseHsl('hls(1,2,3)');

			expect(consoleError).toHaveBeenCalledTimes(1);
			expect(consoleError.mock.lastCall).toMatchInlineSnapshot(`
			[
			  "parseHsl failed to parse input: 'hls(1,2,3)'",
			]
		`);

			process.env.NODE_ENV = NODE_ENV;
		});

		it('should not log an error in prod environments', () => {
			process.env.NODE_ENV = 'production';

			parseHsl('hls(1,2,3)');

			expect(consoleError).not.toHaveBeenCalled();

			process.env.NODE_ENV = NODE_ENV;
		});

		describe('should return null', () => {
			test.each([
				{ value: 'hls(1, 2, 3)', description: 'invalid opening characters' },
				{ value: 'hsl(1, 2)', description: 'too few arguments' },
				{ value: 'hsl(1 2 3)', description: 'modern syntax' },
			])('$description', ({ value }) => {
				expect(parseHsl(value)).toBeNull();
			});
		});
	});

	it('should not require whitespace or units', () => {
		const result = parseHsl('hsl(123,17,29)');
		expect(result).toEqual({
			r: 61,
			g: 87,
			b: 63,
		});
	});

	it('should support units', () => {
		const result = parseHsl('hsl(123deg,17%,29%)');
		expect(result).toEqual({
			r: 61,
			g: 87,
			b: 63,
		});
	});

	it('should support whitespace', () => {
		const result = parseHsl('hsl( 123deg, 17%, 29 )');
		expect(result).toEqual({
			r: 61,
			g: 87,
			b: 63,
		});
	});

	it('should cap percentages at 100%', () => {
		/**
		 * Result for a percentage that is already capped
		 */
		const cappedInputResult = parseHsl('hsl(90deg, 100%, 33%)');
		expect(cappedInputResult).toEqual({
			r: 84,
			g: 168,
			b: 0,
		});

		/**
		 * Result for a percentage that is uncapped
		 */
		const uncappedInputResult = parseHsl('hsl(90deg, 200%, 33%)');
		expect(uncappedInputResult).toEqual(cappedInputResult);
	});

	it('should normalize hue rotation', () => {
		/**
		 * Result for a hue that is already normalized
		 */
		const normalizedInputResult = parseHsl('hsl(90deg, 100%, 33%)');
		expect(normalizedInputResult).toEqual({
			r: 84,
			g: 168,
			b: 0,
		});

		/**
		 * Result for a hue that is not normalized.
		 *
		 * Angles should 'wrap' and be treated as if they are mod 360
		 */
		const unnormalizedInputResult = parseHsl('hsl(450deg, 100%, 33%)');
		expect(unnormalizedInputResult).toEqual(normalizedInputResult);
	});
});
