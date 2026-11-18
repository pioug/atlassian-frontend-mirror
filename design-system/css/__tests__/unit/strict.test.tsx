/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';

import { css, cssMap } from '@atlaskit/css';
import type MediaAboveXxs from '@atlaskit/css/at-rules/media-above-xxs';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

const stylesStyles = css({ color: 'var(--ds-link)' });
const gapStyles = cssMap({
	root: {
		display: 'grid',
		gap: token('space.gap.medium'),
		rowGap: token('space.gap.small'),
		columnGap: token('space.gap.large'),
	},
});

const allViewportStyles = cssMap({
	root: {
		['@media all' satisfies MediaAboveXxs]: {
			color: 'var(--ds-link)',
			paddingBlockEnd: token('space.300'),
		},
	},
});
const allViewportCss = css({
	['@media all' satisfies MediaAboveXxs]: {
		color: 'var(--ds-link)',
	},
});

const arbitraryQueryStyles = cssMap({
	root: {
		// @ts-expect-error Arbitrary queries remain outside the canonical media contract.
		'@media (min-width: 1px)': { color: 'var(--ds-link)' },
	},
});
const negativeQueryStyles = cssMap({
	root: {
		// @ts-expect-error Negative minima remain outside the canonical media contract.
		'@media (min-width: -1px)': { color: 'var(--ds-link)' },
	},
});
const rawSpacingStyles = cssMap({
	root: {
		'@media all': {
			// @ts-expect-error All-viewports queries still require tokenized spacing.
			paddingBlockEnd: '13px',
		},
	},
});

void arbitraryQueryStyles;
void negativeQueryStyles;
void rawSpacingStyles;

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('strict compiled tests', () => {
	it('supports the public all-viewports query in css and Box xcss', () => {
		const { container } = render(
			<div>
				<Box as="dd" xcss={allViewportStyles.root}>
					Map
				</Box>
				<div css={allViewportCss}>Css</div>
			</div>,
		);

		expect(screen.getByText('Map').tagName).toBe('DD');
		// The optimizer emits an empty media condition, which the Compiled matcher cannot parse.
		// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Stylesheet emission has no accessible query or working Compiled matcher.
		const emittedStyles = Array.from(container.querySelectorAll('style')).map(
			(style) => style.textContent,
		);
		const mediaStyles = emittedStyles.filter((style) => style?.startsWith('@media{'));
		expect(mediaStyles).toHaveLength(2);
		for (const [index, text] of ['Map', 'Css'].entries()) {
			for (const match of mediaStyles[index]?.matchAll(/\.([\w-]+)\{/g) ?? []) {
				expect(screen.getByText(text)).toHaveClass(match[1]);
			}
		}
		expect(emittedStyles.join('')).toContain('color:var(--ds-link)');
		expect(emittedStyles.join('')).toContain('padding-block-end:var(--ds-space-300,24px)');
	});

	it('supports semantic gap tokens in gap properties', () => {
		render(<div css={gapStyles.root}>Gap tokens</div>);
		expect(screen.getByText('Gap tokens')).toHaveCompiledCss({
			rowGap: 'var(--ds-space-gap-small,6px)',
			columnGap: 'var(--ds-space-gap-large,9pt)',
		});
	});

	it('should assert colors exist', () => {
		render(<div css={stylesStyles}>Foo</div>);

		expect(screen.getByText('Foo')).toHaveCompiledCss('color', 'var(--ds-link)');
	});
});
