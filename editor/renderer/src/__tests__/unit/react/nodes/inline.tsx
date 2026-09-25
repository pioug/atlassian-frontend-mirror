import React from 'react';

import { render } from '@atlassian/testing-library/render';

import Inline, { hasRenderableChild } from '../../../../react/nodes/inline';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - React/Nodes/Inline', () => {
	describe('hasRenderableChild', () => {
		const cases: Array<[string, React.ReactNode]> = [
			['undefined', undefined],
			['null', null],
			['false', false],
			['true', true],
			['empty array', []],
			['array of null/false', [null, false]],
			['nested empty arrays', [[], [[]]]],
			['empty string', ''],
			['array with empty string', ['']],
			['string', 'a'],
			['zero', 0],
			['element', <span key="a" />],
			['array with element', [<span key="a" />]],
			['deeply nested element', [[null], [[<span key="a" />]]]],
			['empty fragment', <></>],
			['mixed', [null, 'text', false]],
		];

		it.each(cases)('matches React.Children.toArray semantics for %s', (_label, input) => {
			expect(hasRenderableChild(input)).toBe(React.Children.toArray(input).length > 0);
		});
	});

	// `Inline` no longer reads the experiment; the behaviour is driven by the prop that
	// `ReactSerializer` threads down through `Paragraph`.
	describe.each([
		['fast path prop set', true],
		['fast path prop unset', undefined],
	])('with %s', (_label, plainTextFastPath) => {
		it('renders &nbsp; for empty children', () => {
			const { container } = render(
				<p>
					<Inline plainTextFastPath={plainTextFastPath}>{[]}</Inline>
				</p>,
			);
			expect(container.querySelector('p')?.innerHTML).toBe('&nbsp;');
		});

		it('renders &nbsp; for children that are only null/boolean', () => {
			const { container } = render(
				<p>
					<Inline plainTextFastPath={plainTextFastPath}>{[null, false, [undefined]]}</Inline>
				</p>,
			);
			expect(container.querySelector('p')?.innerHTML).toBe('&nbsp;');
		});

		it('passes non-empty children through unchanged', () => {
			const { container } = render(
				<p>
					<Inline plainTextFastPath={plainTextFastPath}>
						{['hello ', <strong key="s">world</strong>]}
					</Inline>
				</p>,
			);
			expect(container.querySelector('p')?.innerHTML).toBe('hello <strong>world</strong>');
		});
	});
});
