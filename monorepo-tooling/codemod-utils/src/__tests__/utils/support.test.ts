import { callExpressionArgMatchesString } from '../../utils/support';

describe('callExpressionArgMatchesString', () => {
	it('should return TRUE when the template string without any passed value match', () => {
		const arg = {
			type: 'TemplateLiteral',
			quasis: [{ value: { raw: 'Expression literal ' } }, { value: { raw: ' match' } }],
		} as any;
		const str = 'Expression literal match';

		const result = callExpressionArgMatchesString(arg, str);

		expect(result).toBe(true);
	});

	it(`should return FALSE when the template string without any passed value
    does not match`, () => {
		const arg = {
			type: 'TemplateLiteral',
			quasis: [{ value: { raw: 'Expression literals ' } }, { value: { raw: ' not-match' } }],
		} as any;
		const str = 'Expression literal match';

		const result = callExpressionArgMatchesString(arg, str);

		expect(result).toBe(false);
	});

	it('should return TRUE when the template string with some passed value match', () => {
		const arg = {
			type: 'TemplateLiteral',
			quasis: [{ value: { raw: 'Expression literal ' } }, { value: { raw: ' match' } }],
		} as any;
		const str = 'Expression literal passed value match';

		const result = callExpressionArgMatchesString(arg, str);

		expect(result).toBe(true);
	});

	it('should return FALSE when the template string with some passed value does not match', () => {
		const arg = {
			type: 'TemplateLiteral',
			quasis: [{ value: { raw: 'Expression literals ' } }, { value: { raw: ' not-match' } }],
		} as any;
		const str = 'Expression literal passed value match';

		const result = callExpressionArgMatchesString(arg, str);

		expect(result).toBe(false);
	});

	it('should return TRUE when a Literal string has some wildcard values passed', () => {
		const arg = {
			type: 'Literal',
			value: 'Expression literal passed value %d',
		} as any;
		const str = 'Expression literal passed value match';

		const result = callExpressionArgMatchesString(arg, str);

		expect(result).toBe(true);
	});
});
