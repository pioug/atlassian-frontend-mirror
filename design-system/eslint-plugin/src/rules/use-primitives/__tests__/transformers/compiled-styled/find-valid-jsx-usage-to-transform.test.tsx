import type { Scope } from 'eslint';
import j from 'jscodeshift';

import { findValidJsxUsageToTransform } from '../../../transformers/compiled-styled/find-valid-jsx-usage-to-transform';

describe('findValidJsxUsageToTransform', () => {
	it('handles basic use case', () => {
		// ARRANGE
		const root = j(`
    import { styled } from '@compiled/react';
    const MyContainer = styled.div({ padding: '8px' });
    <MyContainer>Hello, World!</MyContainer>
    `);
		const jsxRef = root.find(j.JSXIdentifier).get().value;
		jsxRef.parent = root.find(j.JSXOpeningElement).get().value;
		const dummyScope = {
			variables: [
				{
					name: 'MyContainer',
					references: [
						undefined, // not used
						{
							identifier: jsxRef,
						},
					],
				},
			],
		} as Scope.Scope;

		// ACT
		const result = findValidJsxUsageToTransform('MyContainer', dummyScope);

		// ASSERT
		expect(result).toBeDefined();
	});

	it('handles basic use case when styled declaration comes after JSX', () => {
		// ARRANGE
		const root = j(`
    import { styled } from '@compiled/react';
    <MyContainer>Hello, World!</MyContainer>
    const MyContainer = styled.div({ padding: '8px' });
    `);
		const jsxRef = root.find(j.JSXIdentifier).get().value;
		jsxRef.parent = root.find(j.JSXOpeningElement).get().value;
		const dummyScope = {
			variables: [
				{
					name: 'MyContainer',
					references: [
						{
							identifier: jsxRef,
						},
						undefined, // not used
					],
				},
			],
		} as Scope.Scope;

		// ACT
		const result = findValidJsxUsageToTransform('MyContainer', dummyScope, true);

		// ASSERT
		expect(result).toBeDefined();
	});

	it('skips if more than two references are found', () => {
		// ARRANGE
		const root = j(`
    import { styled } from '@compiled/react';
    const MyContainer = styled.div({ padding: '8px' });
    <MyContainer>Hello, World!</MyContainer>
    `);
		const jsxRef = root.find(j.JSXIdentifier).get().value;
		jsxRef.parent = root.find(j.JSXOpeningElement).get().value;
		const dummyScope = {
			variables: [
				{
					name: 'MyContainer',
					references: [
						undefined, // not used
						{
							identifier: jsxRef,
						},
						undefined, // a third reference to the `MyContainer` variable
					],
				},
			],
		} as Scope.Scope;

		// ACT
		const result = findValidJsxUsageToTransform('MyContainer', dummyScope);

		// ASSERT
		expect(result).toBeUndefined();
	});

	it('skips if a single reference is found, ie, an unused styled component', () => {
		// ARRANGE
		const root = j(`
    import { styled } from '@compiled/react';
    const MyContainer = styled.div({ padding: '8px' });
    <MyContainer>Hello, World!</MyContainer>
    `);
		const jsxRef = root.find(j.JSXIdentifier).get().value;
		jsxRef.parent = root.find(j.JSXOpeningElement).get().value;
		const dummyScope = {
			variables: [
				{
					name: 'MyContainer',
					references: [
						undefined, // the value itself is meaningless, we just count the number of entries in the array
					],
				},
			],
		} as unknown as Scope.Scope;

		// ACT
		const result = findValidJsxUsageToTransform('MyContainer', dummyScope);

		// ASSERT
		expect(result).toBeUndefined();
	});

	it('skips if JSX call site has any props', () => {
		// ARRANGE
		const root = j(`
    import { styled } from '@compiled/react';
    const MyContainer = styled.div({ padding: '8px' });
    <MyContainer id="foobar">Hello, World!</MyContainer>
    `);
		const jsxRef = root.find(j.JSXIdentifier).get().value;
		jsxRef.parent = root.find(j.JSXOpeningElement).get().value;
		const dummyScope = {
			variables: [
				{
					name: 'MyContainer',
					references: [
						undefined, // not used
						{
							identifier: jsxRef,
						},
					],
				},
			],
		} as Scope.Scope;

		// ACT
		const result = findValidJsxUsageToTransform('MyContainer', dummyScope);

		// ASSERT
		expect(result).toBeUndefined();
	});
});
