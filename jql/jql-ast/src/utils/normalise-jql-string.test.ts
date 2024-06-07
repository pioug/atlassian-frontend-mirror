import {
	isDoubleQuoted,
	isQuoted,
	isSingleQuoted,
	normaliseJqlString,
} from './normalise-jql-string';

describe('isSingleQuoted', () => {
	it('returns true for single quoted strings', () => {
		expect(isSingleQuoted("'a b c'")).toBe(true);
	});

	it('returns false for double quoted strings', () => {
		expect(isSingleQuoted('"a b c"')).toBe(false);
	});

	it('returns false for unquoted strings', () => {
		expect(isSingleQuoted('a b c')).toBe(false);
	});

	it('returns false if there is no opening quote', () => {
		expect(isSingleQuoted("a b c'")).toBe(false);
	});

	it('returns false if there is no closing quote', () => {
		expect(isSingleQuoted("'a b c")).toBe(false);
	});

	it('returns false if closing quote is escaped', () => {
		expect(isSingleQuoted("'a b c\\'")).toBe(false);
	});
});

describe('isDoubleQuoted', () => {
	it('returns true for double quoted strings', () => {
		expect(isDoubleQuoted('"a b c"')).toBe(true);
	});

	it('returns false for single quoted strings', () => {
		expect(isDoubleQuoted("'a b c'")).toBe(false);
	});

	it('returns false for unquoted strings', () => {
		expect(isDoubleQuoted('a b c')).toBe(false);
	});

	it('returns false if there is no opening quote', () => {
		expect(isDoubleQuoted('a b c"')).toBe(false);
	});

	it('returns false if there is no closing quote', () => {
		expect(isDoubleQuoted('"a b c')).toBe(false);
	});

	it('returns false if closing quote is escaped', () => {
		expect(isDoubleQuoted('"quoted\\"')).toBe(false);
	});
});

describe('isQuoted', () => {
	it('returns true for quoted strings', () => {
		expect(isQuoted("'a b c'")).toBe(true);
	});

	it('returns true for double quoted strings', () => {
		expect(isQuoted('"a b c"')).toBe(true);
	});

	it('returns false for unquoted strings', () => {
		expect(isQuoted('a b c')).toBe(false);
	});
});

describe('normaliseJqlString', () => {
	it('returns the original string if unquoted', () => {
		expect(normaliseJqlString('a b c')).toBe('a b c');
	});

	it('removes surrounding quotes', () => {
		expect(normaliseJqlString('"a b c"')).toBe('a b c');
		expect(normaliseJqlString("'a b c'")).toBe('a b c');
	});

	it('removes opening quotes', () => {
		expect(normaliseJqlString('"a b c')).toBe('a b c');
		expect(normaliseJqlString("'a b c")).toBe('a b c');
	});

	it('keeps escaped characters when string is unquoted', () => {
		expect(normaliseJqlString('a b c \\n')).toBe('a b c \\n');
	});

	it('unescapes escaped characters when string is quoted', () => {
		expect(normaliseJqlString("'a b \\\\n c \\''")).toBe("a b \\n c '");
		expect(normaliseJqlString('"a b \\\\n c \\""')).toBe('a b \\n c "');
	});

	it('unescapes escaped characters when string is partially quoted', () => {
		expect(normaliseJqlString("'a b \\\\n c \\'")).toBe("a b \\n c '");
		expect(normaliseJqlString('"a b \\\\n c \\"')).toBe('a b \\n c "');
	});
});
