import { CharStreams, CommonTokenStream } from 'antlr4ts';

import { JQLLexer, JQLParser } from '../../src';

const mockSyntaxError = jest.fn();
const mockErrorListener = { syntaxError: mockSyntaxError };

const getParser = (query: string) => {
	const charStream = CharStreams.fromString(query);
	const lexer = new JQLLexer(charStream);
	const tokenStream = new CommonTokenStream(lexer);
	const parser = new JQLParser(tokenStream);
	parser.removeErrorListeners();
	parser.addErrorListener(mockErrorListener);
	return parser;
};

export const assertValid = (queries: string[]): void => {
	queries.forEach((query) => {
		it(`🟩 ${query}`, () => {
			mockSyntaxError.mockReset();
			const parser = getParser(query);
			parser.jqlQuery();
			expect(mockSyntaxError).not.toHaveBeenCalled();
		});
	});
};

export const assertInvalid = (invalid: string[]) => {
	invalid.forEach((query) => {
		it(`🟥 ${query}`, () => {
			mockSyntaxError.mockReset();
			const parser = getParser(query);
			parser.jqlQuery();
			expect(mockSyntaxError).toHaveBeenCalled();
		});
	});
};
