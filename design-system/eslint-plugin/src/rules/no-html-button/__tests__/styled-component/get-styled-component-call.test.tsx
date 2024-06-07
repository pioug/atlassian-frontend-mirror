import j from 'jscodeshift';

import { getStyledComponentCall } from '../../node-types/styled-component/get-styled-component-call';

describe('getStyledComponentCall', () => {
	it('returns reference to a suitable styled component', () => {
		const root = j(`const MyContainer = styled.button({ padding: '8px' });`);
		const node = root.find(j.CallExpression).get().value;
		node.parent = root.find(j.VariableDeclarator).get().value;

		const result = getStyledComponentCall(node);

		expect(result).toBeDefined();
	});

	['styled3', 'someStyled'].map((o) =>
		it(`skips if object used is not styled or styled2 (test for: ${o})`, () => {
			const root = j(`const MyContainer = ${o}.button({ padding: '8px' });`);
			const node = root.find(j.CallExpression).get().value;
			node.parent = root.find(j.VariableDeclarator).get().value;

			const result = getStyledComponentCall(node);

			expect(result).toBeUndefined();
		}),
	);

	it('skips if styled component is being exported', () => {
		const root = j(`export const MyContainer = styled.button({ padding: '8px' });`);
		const node = root.find(j.CallExpression).get().value;
		const parent = root.find(j.VariableDeclarator).get().value;
		parent.parent = root.find(j.ExportNamedDeclaration).get().value;
		node.parent = parent;

		const result = getStyledComponentCall(node);

		expect(result).toBeUndefined();
	});
});
