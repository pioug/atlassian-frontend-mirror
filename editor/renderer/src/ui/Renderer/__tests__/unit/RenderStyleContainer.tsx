import React from 'react';
import { render, screen } from '@testing-library/react';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { RendererStyleContainer } from '../../RendererStyleContainer';
import { tableBackgroundColorNameByHex } from '@atlaskit/adf-schema/tableNodes';
import { BaseTheme } from '@atlaskit/editor-common/ui';
import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';
import { setGlobalTheme } from '@atlaskit/tokens/set-global-theme';

// Emotion retains styles from earlier renders, including other feature-gate variants.
// Read only rules scoped to this container so those variants cannot affect assertions.
const getContainerStyleRules = (container: HTMLElement): CSSStyleRule[] =>
	Array.from(document.styleSheets)
		.flatMap((sheet) => Array.from(sheet.cssRules))
		.filter(
			(rule): rule is CSSStyleRule =>
				rule instanceof CSSStyleRule &&
				Array.from(container.classList).some((className) =>
					rule.selectorText.startsWith(`.${className} `),
				),
		);

describe('RendererStyleContainer', () => {
	beforeEach(() => {
		setGlobalTheme({ typography: 'typography' });
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<RendererStyleContainer
				appearance={'full-page'}
				allowNestedHeaderLinks={false}
				useBlockRenderForCodeBlock={false}
			>
				<div>Hello world</div>
			</RendererStyleContainer>,
		);

		await expect(container).toBeAccessible();
	});

	it('should render children', () => {
		const { getByText } = render(
			<RendererStyleContainer
				appearance={'full-page'}
				allowNestedHeaderLinks={false}
				useBlockRenderForCodeBlock={false}
			>
				<div>Hello world</div>
			</RendererStyleContainer>,
		);
		expect(getByText('Hello world')).toBeTruthy();
	});

	it('allows text adjacent to a migrated inline-bodied macro to wrap as inline content', () => {
		passGate('platform_forge_inline_bodied_macro');

		render(
			<RendererStyleContainer
				appearance="full-page"
				allowNestedHeaderLinks={false}
				useBlockRenderForCodeBlock={false}
				testId="renderer-container"
			>
				<div />
			</RendererStyleContainer>,
		);

		const containerRules = getContainerStyleRules(screen.getByTestId('renderer-container'));
		const migratedFlowRules = containerRules.filter((rule) =>
			rule.selectorText.includes('[data-migrated-inline]'),
		);
		const migratedFlowSelectors = migratedFlowRules.map((rule) => rule.selectorText).join(', ');

		expect(migratedFlowRules.length).toBeGreaterThan(0);
		expect(migratedFlowSelectors.match(/\[data-migrated-inline\]/gu)).toHaveLength(2);
		expect(migratedFlowSelectors.match(/\[data-as-inline=["']?on["']?\]/gu)).toHaveLength(2);
		expect(migratedFlowSelectors).toContain(':has(');
		expect(migratedFlowRules.every((rule) => rule.style.display === 'inline')).toBe(true);
		expect(containerRules.some((rule) => rule.selectorText.includes('[data-forge-inline]'))).toBe(
			true,
		);
	});

	it('omits native and migrated inline-bodied styles when the gate is off', () => {
		failGate('platform_forge_inline_bodied_macro');

		render(
			<RendererStyleContainer
				appearance="full-page"
				allowNestedHeaderLinks={false}
				useBlockRenderForCodeBlock={false}
				testId="renderer-container"
			>
				<div />
			</RendererStyleContainer>,
		);

		const containerRules = getContainerStyleRules(screen.getByTestId('renderer-container'));
		expect(containerRules.length).toBeGreaterThan(0);
		expect(
			containerRules.filter(
				(rule) =>
					rule.selectorText.includes('[data-migrated-inline]') ||
					rule.selectorText.includes('[data-forge-inline]'),
			),
		).toHaveLength(0);
	});

	it('should keep the editor visual refresh headings and paragraph styles', async () => {
		render(
			<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
				<RendererStyleContainer
					appearance="full-page"
					allowNestedHeaderLinks={false}
					useBlockRenderForCodeBlock={false}
					testId="renderer-container"
				>
					<h1>Heading 1</h1>
					<h2>Heading 2</h2>
					<h3>Heading 3</h3>
					<h4>Heading 4</h4>
					<h5>Heading 5</h5>
					<h6>Heading 6</h6>
					<p>paragraph</p>
				</RendererStyleContainer>
			</BaseTheme>,
		);

		const container = screen.getByTestId('renderer-container');
		[1, 2, 3, 4, 5, 6].forEach((index) => {
			const value = container.style.getPropertyValue(`--ak-renderer-editor-font-heading-h${index}`);
			expect(value).not.toEqual('');
		});
		const paragraphFont = container.style.getPropertyValue('--ak-renderer-editor-font-normal-text');
		expect(paragraphFont).not.toEqual('');
	});

	/**
	 * `tableSharedStyle` hand-maintains one rule per table cell background colour, keyed on the
	 * `colorname` attribute that the table cell node derives from `tableBackgroundColorNameByHex`.
	 * Nothing links the two, so a colour added to the palette without a matching rule renders with
	 * no background. This is the renderer half of the parity guard added for HOT-305120.
	 *
	 * The assertion runs against the CSS the container actually emits rather than its source, so it
	 * is unaffected by how the rules are written and also catches a rule that exists but is never
	 * composed into the container. It reads the rules through the CSSOM rather than `toHaveStyle`,
	 * because they are checked for existence rather than applied to an element - nothing here
	 * renders a table cell for them to match.
	 *
	 * Unlike the editor, the renderer sets each background to a design token directly rather than a
	 * CSS custom property, so the token values are not derivable from the palette and are not
	 * asserted here.
	 */
	it('should emit an important td and th background rule for exactly the colours in the palette', () => {
		render(
			<RendererStyleContainer
				appearance="full-page"
				allowNestedHeaderLinks={false}
				useBlockRenderForCodeBlock={false}
				testId="renderer-container"
			>
				<div />
			</RendererStyleContainer>,
		);

		// One entry per emitted rule, as `<colours>: <tags> <priority>`, eg
		// `light blue: td,th important`. Collapsing each rule to a single string means one
		// assertion covers the colour, both tags and the priority, and reports every drift at
		// once. The priority matters: these rules override the cell's inline background, so a
		// rule that loses `!important` silently stops applying.
		const target = /\b(td|th)\[colorname="?([^"\]]+?)"? i\]/gu;
		const emittedRules = getContainerStyleRules(screen.getByTestId('renderer-container'))
			.filter((rule) => rule.selectorText.includes('[colorname='))
			.map((rule) => {
				const targets = Array.from(rule.selectorText.matchAll(target));
				const colorNames = Array.from(new Set(targets.map(([, , colorName]) => colorName))).sort();
				const tags = Array.from(new Set(targets.map(([, tag]) => tag))).sort();

				return `${colorNames.join('+')}: ${tags.join(',')} ${rule.style.getPropertyPriority(
					'background-color',
				)}`;
			})
			.sort();

		const expected = Array.from(
			new Set(Array.from(tableBackgroundColorNameByHex.values()).map((name) => name.toLowerCase())),
		)
			.map((colorName) => `${colorName}: td,th important`)
			.sort();

		expect(emittedRules).toEqual(expected);
	});
});
