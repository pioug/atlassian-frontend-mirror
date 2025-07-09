import { type ParserErrorListener, type Recognizer, type Token } from 'antlr4ts';

import { JastBuilder } from '@atlaskit/jql-ast';

import { mockIntl } from '../../../mocks';

import JQLEditorErrorStrategy, {
	getJavaCodeFromChar,
	getPrintableChar,
} from './JQLEditorErrorStrategy';
import { errorMessages } from './messages';

type TestCase = {
	jql: string;
	values?: Record<string, any>;
};

class MockErrorListener implements ParserErrorListener {
	errorMessage = jest.fn();
	syntaxError = <T extends Token>(
		_recognizer: Recognizer<T, any>,
		_offendingSymbol: T | undefined,
		_line: number,
		_charPositionInLine: number,
		msg: string,
	) => {
		this.errorMessage(msg);
	};
}

const errorListener = new MockErrorListener();
const jastBuilder = new JastBuilder()
	.setErrorHandler(new JQLEditorErrorStrategy({ current: mockIntl }))
	.setErrorListeners([errorListener]);

type MessageKeys = keyof typeof errorMessages;

// To ensure generated xml test reports are valid https://en.wikipedia.org/wiki/Valid_characters_in_XML#XML_1.0
const replaceXmlIncompatibleCodepoint = (text: string) =>
	text.replace(/[^\u0009\u000A\u000D\u0020-\u00ff]/, (match: string) => getPrintableChar(match));

const testValidation = (descriptorName: MessageKeys, testCases: TestCase[]) => {
	testCases.forEach(({ jql, values }) => {
		it(replaceXmlIncompatibleCodepoint(jql), () => {
			jastBuilder.build(jql);
			const message = mockIntl.formatMessage(errorMessages[descriptorName], values);
			expect(errorListener.errorMessage).toBeCalledWith(message);
		});
	});
};

const hasMatchingValidation = (descriptorName: MessageKeys, testCases: TestCase[]) => {
	describe(`has matching validation message "${descriptorName}" for JQL:`, () => {
		testValidation(descriptorName, testCases);
	});
};

const hasAlternateValidation = (descriptorName: MessageKeys, testCases: TestCase[]) => {
	describe(`has alternate validation message "${descriptorName}" for JQL:`, () => {
		testValidation(descriptorName, testCases);
	});
};

const hasNoValidation = (testCases: TestCase[]) => {
	describe(`has no validation message for JQL:`, () => {
		testCases.forEach(({ jql }) => {
			it(replaceXmlIncompatibleCodepoint(jql), () => {
				jastBuilder.build(jql);
				expect(errorListener.errorMessage).not.toBeCalled();
			});
		});
	});
};

/**
 * The tests in this file aim to ensure parity in syntax validation between the Monolith and FE parser.
 */
describe('JQLEditorErrorStrategy parity tests', () => {
	beforeEach(() => {
		errorListener.errorMessage.mockClear();
	});

	describe('jql.parse.reserved.word', () => {
		const testCases: TestCase[] = [
			{ jql: `pri notin (x)`, values: { word: 'notin' } },
			{ jql: `field = open`, values: { word: 'field' } },
			{ jql: `status = select()`, values: { word: 'select' } },
			{ jql: `status was not field`, values: { word: 'field' } },
		];

		hasMatchingValidation('reservedWord', testCases);
	});

	describe('jql.parse.illegal.escape', () => {
		const testCases: TestCase[] = [
			{ jql: `test = case\\k`, values: { received: `\\k` } },
			{ jql: `test = case\\u`, values: { received: `\\u` } },
			{ jql: `test = case\\u278q`, values: { received: `\\u278q` } },
			{ jql: `test = case\\u27`, values: { received: `\\u27` } },
			{ jql: `test = case\\u-998`, values: { received: `\\u-998` } },
			{ jql: `test = case order by \\u-998`, values: { received: `\\u-998` } },
			{ jql: `test = case\\uzzzz`, values: { received: `\\uzzzz` } },
			{ jql: `test = case\\u278qzzzz`, values: { received: `\\u278qzzzz` } },
			{ jql: `test = case\\u27zzzzz`, values: { received: `\\u27zzzzz` } },
			{ jql: `tecase\\u-998zzzzz`, values: { received: `\\u-998zzzzz` } },
			{
				jql: `test = case order by \\u-998zzzzz`,
				values: { received: `\\u-998zzzzz` },
			},
			{ jql: `test = "case\\k"`, values: { received: `\\k` } },
			{ jql: `'test\\u`, values: { received: `\\u` } },
		];

		hasMatchingValidation('illegalEscape', testCases);
	});

	describe('jql.parse.illegal.escape.blank', () => {
		const testCases: TestCase[] = [
			{ jql: `test = case\\` },
			{ jql: `test = "case\\` },
			{ jql: `'test\\` },
		];

		hasMatchingValidation('illegalEscapeBlank', testCases);
	});

	describe('jql.parse.unfinished.string', () => {
		const testCases: TestCase[] = [
			{ jql: `what = hrejw'ewjrhejkw`, values: { received: `ewjrhejkw` } },
			{
				jql: `wh"at = hrejwewjrhejkw`,
				values: { received: `at = hrejwewjrhejkw` },
			},
		];

		hasMatchingValidation('unfinishedString', testCases);
	});

	describe('jql.parse.unfinished.string.blank', () => {
		const testCases: TestCase[] = [
			{ jql: `priority = """` },
			{ jql: `priority = "` },
			{ jql: `priority = '''` },
			{ jql: `priority = '` },
			{ jql: `status was not "` },
		];

		hasMatchingValidation('unfinishedStringBlank', testCases);
	});

	describe('jql.parse.illegal.character', () => {
		const matchingTestCases: TestCase[] = [
			{
				jql: `c = q\uffff`,
				values: {
					char: getPrintableChar(`\uffff`),
					escapedChar: getJavaCodeFromChar(`\uffff`),
				},
			},
			{
				jql: `c = c\ufdd0`,
				values: {
					char: getPrintableChar(`\ufdd0`),
					escapedChar: getJavaCodeFromChar(`\ufdd0`),
				},
			},
			{
				jql: `c = aa\ufdd0kkk`,
				values: {
					char: getPrintableChar(`\ufdd0`),
					escapedChar: getJavaCodeFromChar(`\ufdd0`),
				},
			},
			{
				jql: `\u0000iuyiuyiu`,
				values: {
					char: getPrintableChar(`\u0000`),
					escapedChar: getJavaCodeFromChar(`\u0000`),
				},
			},
			{
				jql: `aa = bb order by \u0001`,
				values: {
					char: getPrintableChar(`\u0001`),
					escapedChar: getJavaCodeFromChar(`\u0001`),
				},
			},
			{
				jql: `control = "char\ufffe"`,
				values: {
					char: getPrintableChar(`\ufffe`),
					escapedChar: getJavaCodeFromChar(`\ufffe`),
				},
			},
			{
				jql: `control = "char\ufdef"`,
				values: {
					char: getPrintableChar(`\ufdef`),
					escapedChar: getJavaCodeFromChar(`\ufdef`),
				},
			},
			{
				jql: `"\u001f"`,
				values: {
					char: getPrintableChar(`\u001f`),
					escapedChar: getJavaCodeFromChar(`\u001f`),
				},
			},
			{
				jql: `control = "char\b"`,
				values: {
					char: getPrintableChar(`\b`),
					escapedChar: getJavaCodeFromChar(`\b`),
				},
			},
			{
				jql: `control = a order by "char\b"`,
				values: {
					char: getPrintableChar(`\b`),
					escapedChar: getJavaCodeFromChar(`\b`),
				},
			},
			{
				jql: `control\n = 'char\u0002'`,
				values: {
					char: getPrintableChar(`\u0002`),
					escapedChar: getJavaCodeFromChar(`\u0002`),
				},
			},
			{
				jql: `control = '\ufdd5'`,
				values: {
					char: getPrintableChar(`\ufdd5`),
					escapedChar: getJavaCodeFromChar(`\ufdd5`),
				},
			},
			{
				jql: `control = '\ufdef'`,
				values: {
					char: getPrintableChar(`\ufdef`),
					escapedChar: getJavaCodeFromChar(`\ufdef`),
				},
			},
			{
				jql: `control = 'char\t'`,
				values: {
					char: getPrintableChar(`\t`),
					escapedChar: getJavaCodeFromChar(`\t`),
				},
			},
			{
				jql: `control = a order by 'char\t'`,
				values: {
					char: getPrintableChar(`\t`),
					escapedChar: getJavaCodeFromChar(`\t`),
				},
			},
			{
				jql: `control = fun('\uffff')`,
				values: {
					char: getPrintableChar(`\uffff`),
					escapedChar: getJavaCodeFromChar(`\uffff`),
				},
			},
		];

		hasMatchingValidation('illegalChar', matchingTestCases);
	});

	describe('jql.parse.reserved.character', () => {
		const testCases: TestCase[] = [
			{
				jql: `pri ^ empty`,
				values: { char: `^`, escapedChar: getJavaCodeFromChar(`^`) },
			},
			{
				jql: `$status = open`,
				values: { char: `$`, escapedChar: getJavaCodeFromChar(`$`) },
			},
			{
				jql: `status in %`,
				values: { char: `%`, escapedChar: getJavaCodeFromChar(`%`) },
			},
		];

		hasMatchingValidation('reservedChar', testCases);
	});

	// TODO EM-2747 Need to investigate JQL that produces this error
	// describe('jql.parse.unknown', () => {
	// })

	// TODO EM-2747 Need to investigate JQL that produces this error
	// describe('jql.parse.unknown.pos', () => {
	// })

	// Thrown by the server if a number exceeds the Java max long value. We don't want to embed this platform constraint
	// in our grammar.
	describe('jql.parse.illegal.number', () => {
		const testCases: TestCase[] = [{ jql: `issuetype = 9999999999999999999` }];

		hasNoValidation(testCases);
	});

	describe('jql.parse.empty.field', () => {
		const testCases: TestCase[] = [
			{ jql: `'' = bad` },
			{ jql: `"" = bad` },
			{ jql: `\\     < 38` },
		];

		// TODO EM-2745 We do not handle this case
		hasNoValidation(testCases);
	});

	describe('jql.parse.empty.function', () => {
		const testCases: TestCase[] = [
			{ jql: `a = ''()` },
			{ jql: `b = ""()` },
			{ jql: `a = \\    ()` },
		];

		// TODO EM-2746 We do not handle this case
		hasNoValidation(testCases);
	});

	describe('jql.parse.no.field.eof', () => {
		const testCases: TestCase[] = [
			{ jql: `foo=bar and` },
			{ jql: `foo=bar and not` },
			{ jql: `not` },
			{ jql: `not not` },
			{ jql: `(` },
			{ jql: `  a = b order by` },
			{ jql: `a = b order BY abc desc,` },
		];

		hasMatchingValidation('expectingFieldBeforeEOF', testCases);
	});

	describe('jql.parse.no.field', () => {
		const testCases: TestCase[] = [
			{ jql: `!=`, values: { received: `!=` } },
			{ jql: `and and`, values: { received: `and` } },
			{ jql: `foo=bar and and`, values: { received: `and` } },
			{ jql: `a=b and not not=b`, values: { received: `=` } },
			{ jql: `a = b order BY abc desc, ]`, values: { received: `]` } },
			{ jql: `order BY desc`, values: { received: `desc` } },
		];

		hasMatchingValidation('expectingFieldButReceived', testCases);
	});

	describe('jql.parse.no.cf.field', () => {
		const testCases: TestCase[] = [{ jql: `[issue.status] = x` }, { jql: `[54] = x` }];

		hasMatchingValidation('expectingCFButReceived', testCases);
	});

	// TODO EM-2747 Need to investigate JQL that produces this error
	// describe('jql.parse.no.order.eof', () => {
	// });

	describe('jql.parse.no.order', () => {
		const testCases: TestCase[] = [
			{
				jql: `order BY abc s`,
				values: {
					firstExpectedTokens: `'ASC'`,
					lastExpectedToken: `DESC`,
					received: `s`,
				},
			},
			{
				jql: `order BY abc "ASC"`,
				values: {
					firstExpectedTokens: `'ASC'`,
					lastExpectedToken: `DESC`,
					received: `"ASC"`,
				},
			},
		];

		hasMatchingValidation('expectingMultipleTokensButReceived', testCases);
	});

	describe('jql.parse.expected.text.eof', () => {
		const matchingTestCases: TestCase[] = [
			{ jql: `abc in (foo(`, values: { expectedToken: `)` } },
			{
				jql: `(abc  =        b or not (j=k and p=l)`,
				values: { expectedToken: `)` },
			},
			{ jql: `q = func(a`, values: { expectedToken: `)` } },
			{ jql: `q = func(`, values: { expectedToken: `)` } },
			{ jql: `a = b order`, values: { expectedToken: `BY` } },
			{ jql: `order by issuetype[123`, values: { expectedToken: `]` } },
		];

		hasMatchingValidation('expectingTokenBeforeEOF', matchingTestCases);

		const alternateFunctionTestCases: TestCase[] = [{ jql: `(a in a` }];

		// TODO EM-3131
		hasAlternateValidation('expectingFunctionBeforeEOF', alternateFunctionTestCases);

		const alternateMultipleTokenTestCases: TestCase[] = [
			{
				jql: `abc in ((fee, fie, foe, fum), 787, (34, (45))`,
				values: { firstExpectedTokens: "')'", lastExpectedToken: ',' },
			},
			{
				jql: `abc in (foo`,
				values: { firstExpectedTokens: "')'", lastExpectedToken: ',' },
			},
			{
				jql: `abc in ((foo), a`,
				values: { firstExpectedTokens: "')'", lastExpectedToken: ',' },
			},
		];

		// TODO EM-3131
		hasAlternateValidation('expectingMultipleTokensBeforeEOF', alternateMultipleTokenTestCases);
	});

	// TODO EM-2747 Need to investigate JQL that produces this error
	// describe('jql.parse.expected.text.2.eof', () => {
	// })

	describe('jql.parse.expected.text', () => {
		const matchingTestCases: TestCase[] = [
			{ jql: `cf[1234 = x`, values: { expectedToken: `]`, received: `=` } },
			{
				jql: `issue.property[x = x`,
				values: { expectedToken: `]`, received: `=` },
			},
			{
				jql: `a = b order bad`,
				values: { expectedToken: `BY`, received: `bad` },
			},
			{
				jql: `issue.property[abc!] = x`,
				values: { expectedToken: `]`, received: `!` },
			},
			{
				jql: `order BY era desc extra`,
				values: { expectedToken: `,`, received: `extra` },
			},
			{
				jql: `q = func(,)`,
				values: { expectedToken: `)`, received: `,` },
			},
		];

		hasMatchingValidation('expectingTokenButReceived', matchingTestCases);

		const alternateCustomFieldTestCases: TestCase[] = [
			{ jql: `cf = brenden`, values: { received: `=` } },
		];

		hasAlternateValidation('expectingCustomFieldId', alternateCustomFieldTestCases);

		const alternateOperatorTestCases: TestCase[] = [
			{ jql: `pri not is empty`, values: { received: `is` } },
		];

		hasAlternateValidation('expectingOperatorButReceived', alternateOperatorTestCases);

		// Monolith validates this query with `Expecting 'NOT' but got '!'` instead of `Expecting 'EMPTY' but got '!'
		const alternateTokenTestCases: TestCase[] = [
			{
				jql: `pri is ! empty`,
				values: { expectedToken: 'EMPTY', received: '!' },
			},
		];

		hasAlternateValidation('expectingTokenButReceived', alternateTokenTestCases);

		const alternateMultipleTokensTestCases: TestCase[] = [
			{
				jql: `abc IN ((foo) abc = a`,
				values: {
					firstExpectedTokens: "')'",
					lastExpectedToken: ',',
					received: `abc`,
				},
			},
		];

		hasAlternateValidation('expectingMultipleTokensButReceived', alternateMultipleTokensTestCases);
	});

	describe('jql.parse.expected.text.2', () => {
		const matchingTestCases: TestCase[] = [
			{
				jql: `q = func(good, jack!, "really good")`,
				values: {
					firstExpectedTokens: `')'`,
					lastExpectedToken: `,`,
					received: `!`,
				},
			},
		];

		hasMatchingValidation('expectingMultipleTokensButReceived', matchingTestCases);

		const alternateTestCases: TestCase[] = [
			// TODO Monolith suggests both ')' and ',' as expected tokens in this case but we only get 1 as our error strategy
			// hits a special path when single token deletion is a viable recovery strategy (i.e. remove the '!'). Should we
			// create a new validation message when single token deletion can be used?
			{
				jql: `q = func(good, jack!)`,
				values: { expectedToken: `)`, received: `!` },
			},
		];

		hasAlternateValidation('expectingTokenButReceived', alternateTestCases);
	});

	describe('jql.parse.no.operator.eof', () => {
		const testCases: TestCase[] = [
			{ jql: `foo` },
			{ jql: `foo=bar and 78foo` },
			{ jql: `foo=bar and \n78foo` },
		];

		hasMatchingValidation('expectingOperatorBeforeEOF', testCases);
	});

	describe('jql.parse.no.operator', () => {
		const testCases: TestCase[] = [
			{
				jql: `foo=bar and 78foo brenden and a=b`,
				values: { received: `brenden` },
			},
			{
				jql: `foo=bar and \n78foo brenden and a=b`,
				values: { received: `brenden` },
			},
			{ jql: `cf1234] = x`, values: { received: `]` } },
			{ jql: `issue.property1234] = x`, values: { received: `]` } },
			{ jql: `pri isnot empty`, values: { received: `isnot` } },
			{ jql: `pri ! in (test)`, values: { received: `!` } },
		];

		hasMatchingValidation('expectingOperatorButReceived', testCases);

		const noValidationTestCases: TestCase[] = [
			// TODO This is because according to the grammar `issue.property[x.1] unresolved` is valid property syntax.
			// Whereas the BE has custom logic to enforce that a property is prefixed with `.`
			{
				jql: `issue.property[x.1] unresolved = b`,
				values: { received: `unresolved` },
			},
		];

		hasNoValidation(noValidationTestCases);
	});

	describe('jql.parse.bad.custom.field.id.eof', () => {
		const testCases: TestCase[] = [{ jql: `cf[` }, { jql: `order by cf[` }];

		hasMatchingValidation('expectingCustomFieldId', testCases);
	});

	describe('jql.parse.bad.custom.field.id', () => {
		const testCases: TestCase[] = [
			{ jql: `cf[z123] = x`, values: { received: `z123` } },
			{ jql: `cf[-123] = x`, values: { received: `-123` } },
			{ jql: `cf[] = x`, values: { received: `]` } },
			{ jql: `order by cf[]`, values: { received: `]` } },
		];

		hasMatchingValidation('expectingCustomFieldId', testCases);
	});

	describe('jql.parse.bad.property.id.eof', () => {
		// These test cases incorrectly return the `jql.parse.bad.function.argument.eof` message in the monolith, but should
		// be returning the message for missing property id.
		const testCases: TestCase[] = [{ jql: `issuetype[` }, { jql: `order by issuetype[` }];

		hasMatchingValidation('expectingFieldPropertyIdBeforeEOF', testCases);
	});

	describe('jql.parse.bad.property.id', () => {
		const incorrectTestCases: TestCase[] = [
			{ jql: `issue.property[] = x`, values: { received: `]` } },
			// These test cases incorrectly return the `jql.parse.bad.function.argument` message in the monolith, but should
			// be returning the message for missing property id.
			{ jql: `issue.property[!] = x`, values: { received: `!` } },
			{ jql: `order by issue.property[!]`, values: { received: `!` } },
		];

		hasMatchingValidation('expectingFieldPropertyIdButReceived', incorrectTestCases);

		// TODO This is because according to the grammar `comment.prop[author]..Author` is valid property syntax.
		// Whereas the BE has custom logic to enforce that a property has a single leading `.`
		const noValidationTestCases: TestCase[] = [{ jql: `comment.prop[author]..Author = Test` }];

		hasNoValidation(noValidationTestCases);
	});

	describe('jql.parse.bad.function.argument.eof', () => {
		const testCases: TestCase[] = [{ jql: `q = func(a, ` }];

		hasMatchingValidation('expectingFunctionArgBeforeEOF', testCases);
	});

	describe('jql.parse.bad.function.argument', () => {
		const matchingTestCases: TestCase[] = [
			{ jql: `q = func(a, [)`, values: { received: `[` } },
			{ jql: `q = func(a, [`, values: { received: `[` } },
		];

		hasMatchingValidation('expectingFunctionArgButReceived', matchingTestCases);

		const alternateTestCases: TestCase[] = [
			{ jql: `q = func( [`, values: { expectedToken: ')', received: `[` } },
		];

		hasAlternateValidation('expectingTokenButReceived', alternateTestCases);
	});

	describe('jql.parse.empty.function.argument', () => {
		const testCases: TestCase[] = [{ jql: `q = func(a, )`, values: { received: `)` } }];

		hasAlternateValidation('expectingFunctionArgButReceived', testCases);
	});

	// TODO EM-2747 Need to investigate JQL that produces this error
	// describe('jql.parse.logical.operator.eof', () => {
	// })

	describe('jql.parse.logical.operator', () => {
		const testCases: TestCase[] = [
			{
				jql: `a=b a=b`,
				values: {
					firstExpectedTokens: `'AND', 'OR'`,
					lastExpectedToken: `ORDER BY`,
					received: `a`,
				},
			},
			{
				jql: `a=b not a=b`,
				values: {
					firstExpectedTokens: `'AND', 'OR'`,
					lastExpectedToken: `ORDER BY`,
					received: `not`,
				},
			},
			{
				jql: `priority = 12345=== not p jfkff fjfjfj`,
				values: {
					firstExpectedTokens: `'AND', 'OR'`,
					lastExpectedToken: `ORDER BY`,
					received: `=`,
				},
			},
			{
				jql: `priority = 12345 \njfkff fjfjfj`,
				values: {
					firstExpectedTokens: `'AND', 'OR'`,
					lastExpectedToken: `ORDER BY`,
					received: `jfkff`,
				},
			},
			{
				jql: `priority=a jfkff=fjfjfj`,
				values: {
					firstExpectedTokens: `'AND', 'OR'`,
					lastExpectedToken: `ORDER BY`,
					received: `jfkff`,
				},
			},
			{
				jql: `priority=12345 jfkff=fjfjfj`,
				values: {
					firstExpectedTokens: `'AND', 'OR'`,
					lastExpectedToken: `ORDER BY`,
					received: `jfkff`,
				},
			},
			{
				jql: `a=b ,b`,
				values: {
					firstExpectedTokens: `'AND', 'OR'`,
					lastExpectedToken: `ORDER BY`,
					received: `,`,
				},
			},
			{
				jql: `a=b,b`,
				values: {
					firstExpectedTokens: `'AND', 'OR'`,
					lastExpectedToken: `ORDER BY`,
					received: `,`,
				},
			},
			{
				jql: `abc in (foo))`,
				values: {
					firstExpectedTokens: `'AND', 'OR'`,
					lastExpectedToken: `ORDER BY`,
					received: `)`,
				},
			},
			{
				jql: `control = f\run()`,
				values: {
					firstExpectedTokens: `'AND', 'OR'`,
					lastExpectedToken: `ORDER BY`,
					received: `un`,
				},
			},
			{
				jql: `query = hello\nworld`,
				values: {
					firstExpectedTokens: `'AND', 'OR'`,
					lastExpectedToken: `ORDER BY`,
					received: `world`,
				},
			},
		];

		hasMatchingValidation('expectingMultipleTokensButReceived', testCases);
	});

	describe('jql.parse.bad.operand.eof', () => {
		const matchingTestCases: TestCase[] = [{ jql: `status in (` }, { jql: `status in (foo, ` }];

		hasMatchingValidation('expectingOperandBeforeEOF', matchingTestCases);

		const alternateValueOrFunctionTestCases: TestCase[] = [
			{ jql: `foo=` },
			{ jql: `foo=bar and 78foo=` },
			{ jql: `foo=bar and not foo =` },
			{ jql: `issue.property[x.1] =` },
			{ jql: `summary ~` },
			{ jql: `summary !~` },
			{ jql: `priority <` },
			{ jql: `priority <=` },
			{ jql: `priority >` },
			{ jql: `priority >=` },
			{ jql: `status was` },
			{ jql: `status was ` },
			{ jql: `status was not` },
			{ jql: `status was not ` },
		];

		hasAlternateValidation('expectingValueOrFunctionBeforeEOF', alternateValueOrFunctionTestCases);

		const alternateListOrFunctionTestCases: TestCase[] = [
			{ jql: `status in` },
			{ jql: `status not in` },
			{ jql: `status was in` },
			{ jql: `status was not in` },
			{ jql: `status was not in ` },
		];

		hasAlternateValidation('expectingListOrFunctionBeforeEOF', alternateListOrFunctionTestCases);

		const alternateTokenTestCases: TestCase[] = [
			{ jql: `pri is`, values: { expectedToken: 'EMPTY' } },
			{ jql: `pri is not`, values: { expectedToken: 'EMPTY' } },
		];

		hasAlternateValidation('expectingTokenBeforeEOF', alternateTokenTestCases);
	});

	describe('jql.parse.bad.operand', () => {
		const testCases: TestCase[] = [{ jql: `abc in (,`, values: { received: `,` } }];

		hasMatchingValidation('expectingOperandButReceived', testCases);

		const alternateValueOrFunctionTestCases: TestCase[] = [
			{ jql: `abc = ()`, values: { received: `(` } },
			{ jql: `abc = )foo(`, values: { received: `)` } },
			{ jql: `abc ~ ()`, values: { received: `(` } },
		];

		hasAlternateValidation(
			'expectingValueOrFunctionButReceived',
			alternateValueOrFunctionTestCases,
		);
	});

	describe('jql.parse.predicate.unsupported', () => {
		const testCases: TestCase[] = [
			{
				jql: `status = todo AFTER now`,
				values: {
					firstExpectedTokens: `'AND', 'OR'`,
					lastExpectedToken: `ORDER BY`,
					received: `AFTER`,
				},
			},
			{
				jql: `status in (todo) BEFORE now after tomorrow`,
				values: {
					firstExpectedTokens: `'AND', 'OR'`,
					lastExpectedToken: `ORDER BY`,
					received: `BEFORE`,
				},
			},
		];

		hasAlternateValidation('expectingMultipleTokensButReceived', testCases);
	});

	describe('jql.parse.operand.unsupported', () => {
		const testCases: TestCase[] = [
			{
				jql: `status changed todo`,
				values: {
					firstExpectedTokens: `'AFTER', 'AND', 'BEFORE', 'BY', 'DURING', 'FROM', 'ON', 'OR', 'ORDER BY'`,
					lastExpectedToken: `TO`,
					received: `todo`,
				},
			},
		];

		hasAlternateValidation('expectingMultipleTokensButReceived', testCases);
	});
});
