import { parseRgb } from '../../formats/rgb';

describe('parseRgb()', () => {
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

			parseRgb('rbg(1, 2, 3)');

			expect(consoleError).toHaveBeenCalledTimes(1);
			expect(consoleError.mock.lastCall).toMatchInlineSnapshot(`
			[
			  "parseRgb failed to parse input: 'rbg(1, 2, 3)'",
			]
		`);

			process.env.NODE_ENV = NODE_ENV;
		});

		it('should not log an error in prod environments', () => {
			process.env.NODE_ENV = 'production';

			parseRgb('rbg(1, 2, 3)');

			expect(consoleError).not.toHaveBeenCalled();

			process.env.NODE_ENV = NODE_ENV;
		});

		describe('should return null', () => {
			test.each([
				{ value: 'rbg(1, 2, 3)', description: 'invalid opening characters' },
				{ value: 'rgb(1, 2)', description: 'too few arguments' },
				{ value: 'rgb(1 2 3)', description: 'modern syntax' },
			])('$description', ({ value }) => {
				expect(parseRgb(value)).toBeNull();
			});
		});
	});

	it('should not require whitespace', () => {
		const result = parseRgb('rgb(0,100,200)');
		expect(result).toEqual({
			r: 0,
			g: 100,
			b: 200,
		});
	});

	it('should handle whitespace', () => {
		const result = parseRgb('rgb( 200 , 0 , 100 )');
		expect(result).toEqual({
			r: 200,
			g: 0,
			b: 100,
		});
	});

	it('should clamp high values', () => {
		const result = parseRgb('rgb(255, 256, 999)');
		expect(result).toEqual({
			r: 255,
			g: 255,
			b: 255,
		});
	});

	it('should clamp low values', () => {
		const result = parseRgb('rgb(-0, -1, -300)');
		expect(result).toEqual({
			r: 0,
			g: 0,
			b: 0,
		});
	});
});
