import { getParser } from './getParser';
import { mockSyntaxError } from './mockSyntaxError';

export const assertInvalid = (invalid: string[]): void => {
	invalid.forEach((query) => {
		it(`🟥 ${query}`, () => {
			mockSyntaxError.mockReset();
			const parser = getParser(query);
			parser.jqlQuery();
			expect(mockSyntaxError).toHaveBeenCalled();
		});
	});
};
