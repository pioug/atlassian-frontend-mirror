import { sanitiseJqlString } from './sanitise-jql-string';

describe('sanitiseJqlString', () => {
	it('does not quote string with only word characters', () => {
		expect(sanitiseJqlString('cf_10012')).toEqual('cf_10012');
	});

	it('quotes strings with whitespace characters', () => {
		expect(sanitiseJqlString('change reason')).toEqual('"change reason"');
		expect(sanitiseJqlString('change\treason')).toEqual('"change\treason"');
		expect(sanitiseJqlString('change\rreason')).toEqual('"change\rreason"');
		expect(sanitiseJqlString('change\nreason')).toEqual('"change\nreason"');
	});

	it('quotes strings with collapsed field syntax', () => {
		expect(sanitiseJqlString('reason[Paragraph]')).toEqual('"reason[Paragraph]"');
	});

	it('quotes and escapes strings with double quotes', () => {
		expect(sanitiseJqlString('"custom"field"')).toEqual('"\\"custom\\"field\\""');
	});

	it('quotes other reserved characters', () => {
		const chars = [
			"'",
			'=',
			'!',
			'<',
			'>',
			'(',
			')',
			'~',
			',',
			'[',
			']',
			'|',
			'&',
			'{',
			'}',
			'*',
			'/',
			'%',
			'+',
			'^',
			'$',
			'#',
			'@',
			'?',
			';',
		];

		chars.forEach((char) => expect(sanitiseJqlString(char)).toEqual(`"${char}"`));
	});
});
