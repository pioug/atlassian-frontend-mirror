import { JastBuilder } from '../../src';

const builder = new JastBuilder();

export const assertValid = (queries: string[]): void => {
	queries.forEach((query) => {
		it(`🟩 ${query}`, () => {
			const ast = builder.build(query);
			expect(ast.errors).toHaveLength(0);
		});
	});
};

export const assertInvalid = (queries: string[]): void => {
	queries.forEach((query) => {
		it(`🟥 ${query}`, () => {
			const ast = builder.build(query);
			expect(ast.errors).not.toHaveLength(0);
		});
	});
};
