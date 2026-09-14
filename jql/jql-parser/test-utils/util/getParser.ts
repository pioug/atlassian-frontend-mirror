import { CharStreams, CommonTokenStream } from 'antlr4ts';

import { JQLLexer } from '../../src/generated/JQLLexer';
import { JQLParser } from '../../src/generated/JQLParser';

import { mockErrorListener } from './mockErrorListener';

export const getParser = (query: string): JQLParser => {
	const charStream = CharStreams.fromString(query);
	const lexer = new JQLLexer(charStream);
	const tokenStream = new CommonTokenStream(lexer);
	const parser = new JQLParser(tokenStream);
	parser.removeErrorListeners();
	parser.addErrorListener(mockErrorListener);
	return parser;
};
