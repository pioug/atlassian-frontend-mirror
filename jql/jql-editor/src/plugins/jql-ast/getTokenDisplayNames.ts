import type { JQLParser } from '@atlaskit/jql-parser/JQLParser';

export const getTokenDisplayNames = (parser: JQLParser, tokens: number[]): string[] => {
	return tokens.map((tokenType) =>
		parser.vocabulary.getDisplayName(tokenType).replace(/^'|'$/g, ''),
	);
};
