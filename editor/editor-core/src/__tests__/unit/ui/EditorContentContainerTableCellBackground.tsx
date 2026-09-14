import React from 'react';

import { tableBackgroundColorNameByHex } from '@atlaskit/adf-schema/tableNodes';
import { tableCellBackgroundColorVariablesForCompiled } from '@atlaskit/editor-common/table-cell-background-for-compiled';
import { render } from '@atlassian/testing-library';

import { EditorContentContainerCompiled } from '../../../ui/EditorContentContainer/EditorContentContainer-compiled';

/**
 * `tableCellBackgroundColorOverrides` hand-maintains one rule per table cell background colour.
 * Each rule is keyed on the `colorname` attribute derived from `tableBackgroundColorNameByHex`,
 * and sets `background-color` to a CSS custom property derived from `tableBackgroundColorNames`.
 * Nothing links those three, and the rules are `!important`, so a rule whose custom property is
 * undefined does not fall back to the inline background - it renders the cell transparent. That
 * is what happened in HOT-305120.
 *
 * These assertions run against the CSS the container actually emits rather than its source, so
 * they are unaffected by how the rules are written and also catch a rule that exists but is
 * never composed into the container. They read the emitted rules through the CSSOM rather than
 * `toHaveStyle`, because the rules are checked for existence rather than applied to an element -
 * nothing in this test renders a table cell for them to match.
 */
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('editor table cell background colour selectors', () => {
	// Compiled drops the quotes around single-word attribute values, so the emitted selectors mix
	// `td[colorname=blue i]` with `td[colorname="light blue" i]`.
	const TARGET = /\b(td|th)\[colorname="?([^"\]]+?)"? i\]/gu;

	const variableNameForColor = (colorName: string) =>
		`--ak-editor-table-cell-background-${colorName.replace(/\s+/gu, '-')}`;

	/**
	 * One entry per emitted rule, as `<colours>: <tags> -> <declaration>`, eg
	 * `light blue: td,th -> var(--ak-editor-table-cell-background-light-blue) !important`.
	 * Collapsing each rule to a single string means one assertion covers the colour, both tags
	 * and the declaration, and reports every drift at once.
	 */
	const emittedRules = (): string[] => {
		render(<EditorContentContainerCompiled />);

		return Array.from(document.styleSheets)
			.flatMap((sheet) => Array.from(sheet.cssRules))
			.filter(
				(rule): rule is CSSStyleRule =>
					rule instanceof CSSStyleRule && rule.selectorText.includes('[colorname='),
			)
			.map((rule) => {
				const targets = Array.from(rule.selectorText.matchAll(TARGET));
				const colorNames = Array.from(new Set(targets.map(([, , colorName]) => colorName)));
				const tags = Array.from(new Set(targets.map(([, tag]) => tag))).sort();
				const priority = rule.style.getPropertyPriority('background-color');

				return `${colorNames.sort().join('+')}: ${tags.join(',')} -> ${rule.style.getPropertyValue(
					'background-color',
				)}${priority ? ` !${priority}` : ''}`;
			})
			.sort();
	};

	it('emits a td and th rule for exactly the colours in the palette', () => {
		const expected = Array.from(
			new Set(Array.from(tableBackgroundColorNameByHex.values()).map((name) => name.toLowerCase())),
		)
			.map(
				(colorName) => `${colorName}: td,th -> var(${variableNameForColor(colorName)}) !important`,
			)
			.sort();

		expect(emittedRules()).toEqual(expected);
	});

	it('only references CSS custom properties that editor-common defines', () => {
		// A colour whose palette lookup fails is silently skipped when the custom properties are
		// built, so a rule can name a property that is never emitted. That is the HOT-305120
		// failure mode, and the assertion above cannot see it: both sides derive from the same
		// palette, so they agree while the property behind the name does not exist.
		const defined = Object.keys(tableCellBackgroundColorVariablesForCompiled);
		const referenced = emittedRules().flatMap((rule) =>
			Array.from(rule.matchAll(/var\((--[a-z-]+)\)/gu), ([, name]) => name),
		);

		expect(referenced.filter((name) => !defined.includes(name))).toEqual([]);
	});
});
