import { getParser } from './getParser';
import { mockSyntaxError } from './mockSyntaxError';

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
