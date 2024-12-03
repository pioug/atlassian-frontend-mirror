/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';

import { isExtendedElement, isStyleElement } from '../../src/test-utils/inline-css';
import {
	type HTMLElementExtended,
	type HTMLStyleElementExtended,
} from '../../src/test-utils/types';

const styles = cssMap({ root: { color: 'red' } });

describe('Inline CSS test util', () => {
	it(`compiled css is removed from text content for none style element`, () => {
		render(
			<div data-testid="outer">
				<div data-testid="inner" css={styles.root}>
					Hello World
				</div>
			</div>,
		);

		const outerElement = screen.getByTestId('outer');
		expect(outerElement).toHaveTextContent(/^Hello World$/);
		expectWithTypeAssertion<HTMLElementExtended>(outerElement, isExtendedElement);
		expect(isStyleElement(outerElement)).toBeFalsy();
		expect(outerElement.textContentOriginal).toMatch(/^\._[a-z0-9]{8}\{color:red}Hello World$/);
		expect(outerElement.textContentWithoutCss).toMatch(/^Hello World$/);
		expectValidTestCase();
	});

	it(`only compiled css is removed from text content for none style element`, () => {
		render(
			<div data-testid="outer">
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles */}
				<style>{'.badIdea{content:"Please don\'t use inline styles"}'}</style>
				<div data-testid="inner" css={styles.root}>
					Hello World
				</div>
			</div>,
		);

		const outerElement = screen.getByTestId('outer');
		expect(outerElement).toHaveTextContent(
			/^.badIdea{content:"Please don't use inline styles"}Hello World$/,
		);
		expect(outerElement).toHaveTextContent(
			'.badIdea{content:"Please don\'t use inline styles"}Hello World',
		);
		expectValidTestCase();
	});

	it('css is included from text content for style elements', () => {
		render(
			<div data-testid="outer">
				<div data-testid="inner" css={styles.root}>
					Hello World
				</div>
			</div>,
		);

		const expectedContent = /^\._[a-z0-9]{8}\{color:red}$/;

		const styleElement = screen
			.getByTestId('outer')
			// eslint-disable-next-line testing-library/no-node-access
			.querySelector('style[data-cmpld]') as HTMLStyleElement;
		expect(styleElement).toBeInTheDocument();
		expect(styleElement).toHaveTextContent(expectedContent);
		expectWithTypeAssertion<HTMLStyleElementExtended>(styleElement, isStyleElement);
		expect(styleElement.textContentOriginal).toMatch(expectedContent);
		expect(styleElement.textContentWithoutCss).toMatch(/^$/);
	});

	it('css has been applied to inner element', () => {
		render(
			<div data-testid="outer">
				<div data-testid="inner" css={styles.root}>
					Hello World
				</div>
			</div>,
		);

		const expectedContent = /^Hello World$/;
		const innerElement = screen.getByTestId('inner');
		expect(innerElement).toHaveTextContent(expectedContent);
		expectWithTypeAssertion<HTMLElementExtended>(innerElement, isExtendedElement);
		expect(isStyleElement(innerElement)).toBeFalsy();
		expect(innerElement.textContentOriginal).toMatch(expectedContent);
		expect(innerElement.textContentWithoutCss).toMatch(expectedContent);
		expect(innerElement).toHaveCompiledCss('color', 'red');
		expectValidTestCase();
	});
});

function expectValidTestCase() {
	// Assert that a Compiled inline style is present so the test is valid
	const styleElement = screen
		.getByTestId('outer')
		// eslint-disable-next-line testing-library/no-node-access
		.querySelector('style[data-cmpld]') as HTMLStyleElement;
	expect(styleElement).toBeInTheDocument();
}

/**
 * Wrapper for expect to include type assertion
 *
 * Asserts that the value is of type T
 * @param value Value
 * @param predicate Predicate
 */
function expectWithTypeAssertion<T, NT = any>(
	value: T | NT,
	predicate: (v: T | NT) => v is T,
): asserts value is T {
	expect(predicate(value)).toBe(true);
}
