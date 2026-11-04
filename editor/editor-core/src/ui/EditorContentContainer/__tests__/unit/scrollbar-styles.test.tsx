import React from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import EditorContentContainer from '../../EditorContentContainer';

// Match the emitted selectors against the real component, rather than a copy of its styles.
const matchingThumbRules = (element: Element) => {
	const rules: CSSStyleRule[] = [];
	for (const sheet of Array.from(document.styleSheets)) {
		for (const rule of Array.from(sheet.cssRules)) {
			if (rule instanceof CSSStyleRule && rule.selectorText.includes('::-webkit-scrollbar-thumb')) {
				const selector = rule.selectorText
					.replace(/::-webkit-scrollbar-thumb(?::hover)?/gu, '')
					.replace(/:hover/gu, '');
				if (element.matches(selector)) {
					rules.push(rule);
				}
			}
		}
	}
	return rules;
};

afterEach(() => {
	document.documentElement.removeAttribute('data-scrollbar-harmonisation');
});

it('preserves the legacy full-page thumb when harmonisation is off', () => {
	render(<EditorContentContainer appearance="full-page">Document</EditorContentContainer>);
	const owner = screen.getByTestId('editor-content-container');
	expect(matchingThumbRules(owner).map((rule) => rule.selectorText)).toHaveLength(3);
});

it('leaves the full-page thumb to css-reset when harmonisation is on', () => {
	document.documentElement.setAttribute('data-scrollbar-harmonisation', '');
	render(<EditorContentContainer appearance="full-page">Document</EditorContentContainer>);
	const owner = screen.getByTestId('editor-content-container');
	expect(matchingThumbRules(owner).map((rule) => rule.selectorText)).toHaveLength(0);
});
