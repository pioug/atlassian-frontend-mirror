import React from 'react';

import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import EditorContentContainer from '../../EditorContentContainer';

const experimentName = 'platform_editor_inline_node_selection_style';
const inRangeClassName = 'ak-editor-inline-node-in-range-selection';
const selectedNodeClassName = 'ak-editor-selected-node';

type InlineNodeFixture = {
	/** Selection treatment the node already has when node-selected with the gate off. */
	legacyNodeSelection: { blanket: boolean; twoPixelRing: boolean };
	/** Node view markup; the element the selection styles target has data-testid="selection-target". */
	markup: (wrapperClassName: string) => string;
	name: string;
	/**
	 * How the selection tint is applied. `underlay` keeps the node's own coloured background and
	 * tints it with a background-image layer under the text; the default replaces the background.
	 */
	tint?: 'underlay';
};

const inlineNodeFixtures: InlineNodeFixture[] = [
	{
		name: 'inline card',
		markup: (wrapperClassName) => `
			<span class="inlineCardView-content-wrap inlineNodeView ${wrapperClassName}">
				<span class="card">
					<span class="loader-wrapper">
						<a data-testid="selection-target" href="https://www.atlassian.com">Inline card</a>
					</span>
				</span>
			</span>`,
		legacyNodeSelection: { blanket: false, twoPixelRing: false },
	},
	{
		name: 'mention',
		markup: (wrapperClassName) => `
			<span class="mentionView-content-wrap inlineNodeView ${wrapperClassName}">
				<span class="editor-mention-primitive" data-testid="selection-target">@Ada</span>
			</span>`,
		legacyNodeSelection: { blanket: false, twoPixelRing: false },
	},
	{
		name: 'status',
		markup: (wrapperClassName) => `
			<span class="statusView-content-wrap inlineNodeView ${wrapperClassName}" data-prosemirror-node-name="status">
				<span class="status-lozenge-span" data-color="red">
					<span class="lozenge-wrapper" data-testid="selection-target">
						<span class="lozenge-text">Done</span>
					</span>
				</span>
			</span>`,
		legacyNodeSelection: { blanket: false, twoPixelRing: false },
		tint: 'underlay',
	},
	{
		name: 'date',
		markup: (wrapperClassName) => `
			<span class="dateView-content-wrap inlineNodeView ${wrapperClassName}">
				<span class="date-lozenger-container">
					<span class="date-node-color-red" data-testid="selection-target">Sep 3, 2020</span>
				</span>
			</span>`,
		legacyNodeSelection: { blanket: false, twoPixelRing: false },
		tint: 'underlay',
	},
	{
		name: 'emoji',
		markup: (wrapperClassName) => `
			<div class="ProseMirror">
				<span data-emoji-id="1f600" class="${wrapperClassName}">
					<span class="emojiView-content-wrap" role="img">
						<span class="emoji-common-emoji-sprite" data-testid="selection-target"></span>
					</span>
				</span>
			</div>`,
		legacyNodeSelection: { blanket: true, twoPixelRing: false },
	},
];

const renderSelectionTarget = (
	fixture: InlineNodeFixture,
	wrapperClassName: string,
	{ editorFocused = true } = {},
) => {
	render(<EditorContentContainer appearance="full-page">Document</EditorContentContainer>);
	const owner = screen.getByTestId('editor-content-container');
	// ProseMirror adds ProseMirror-focused to the editor element while it has focus.
	const focusClassName = editorFocused ? 'ProseMirror-focused' : '';
	owner.innerHTML = `<div class="${focusClassName}">${fixture.markup(wrapperClassName)}</div>`;
	return screen.getByTestId('selection-target');
};

const safelyMatches = (element: Element, selector: string) => {
	try {
		return element.matches(selector);
	} catch {
		// jsdom exposes some at-rules, such as @property, with an unparseable selectorText.
		return false;
	}
};

const splitTopLevelSelectors = (selectorText: string) => {
	const selectors: string[] = [];
	let depth = 0;
	let current = '';
	for (const character of selectorText) {
		if (character === ',' && depth === 0) {
			selectors.push(current);
			current = '';
			continue;
		}
		if (character === '(') {
			depth++;
		} else if (character === ')') {
			depth--;
		}
		current += character;
	}
	selectors.push(current);
	return selectors;
};

// Match the emitted selectors against the real component, rather than a copy of its styles.
const matchingRules = (element: Element, { beforePseudoElement = false } = {}) => {
	const beforePseudoElementPattern = /::?before$/u;
	const rules: CSSStyleRule[] = [];
	for (const sheet of Array.from(document.styleSheets)) {
		for (const rule of Array.from(sheet.cssRules)) {
			if (!(rule instanceof CSSStyleRule)) {
				continue;
			}
			const matchesElement = splitTopLevelSelectors(rule.selectorText).some((selector) => {
				const trimmedSelector = selector.trim();
				const targetsBefore = beforePseudoElementPattern.test(trimmedSelector);
				if (targetsBefore !== beforePseudoElement) {
					return false;
				}
				return safelyMatches(element, trimmedSelector.replace(beforePseudoElementPattern, ''));
			});
			if (matchesElement) {
				rules.push(rule);
			}
		}
	}
	return rules;
};

const hasBlanket = (element: Element) =>
	matchingRules(element, { beforePseudoElement: true }).some((rule) =>
		rule.style.getPropertyValue('background-color').includes('--ds-blanket-selected'),
	);

const hasHighlightBand = (element: Element) =>
	matchingRules(element, { beforePseudoElement: true }).some((rule) =>
		/background-color:\s*highlight/iu.test(rule.cssText),
	);

/** Accent blue rather than the system `Highlight` colour, whose value differs by platform. */
const tintToken = '--ds-background-accent-blue-subtler';

const hasSelectedBackground = (element: Element) =>
	matchingRules(element).some((rule) =>
		rule.style.getPropertyValue('background-color').includes(tintToken),
	);

const hasSelectedUnderlay = (element: Element) =>
	matchingRules(element).some((rule) =>
		new RegExp(`background-image:[^;]*${tintToken}`, 'u').test(rule.cssText),
	);

const hasTwoPixelRing = (element: Element) =>
	matchingRules(element).some((rule) => {
		const boxShadow = rule.style.getPropertyValue('box-shadow');
		return boxShadow.startsWith('0 0 0 2px') && boxShadow.includes('--ds-border-selected');
	});

const expectSelectionTint = (target: Element, fixture: InlineNodeFixture) => {
	if (fixture.tint === 'underlay') {
		expect(hasSelectedUnderlay(target)).toBe(true);
		expect(hasSelectedBackground(target)).toBe(false);
		return;
	}
	expect(hasSelectedBackground(target)).toBe(true);
};

describe.each(inlineNodeFixtures)('$name selection styles', (fixture) => {
	describe('when the experiment is enabled', () => {
		beforeEach(() => {
			mockExpEnabled(experimentName);
		});

		it('shows the selection tint inside a range selection', () => {
			const target = renderSelectionTarget(fixture, inRangeClassName);

			expectSelectionTint(target, fixture);
			expect(hasTwoPixelRing(target)).toBe(false);
		});

		it('does not overlay a tint layer, which would misalign when the node wraps across lines', () => {
			const target = renderSelectionTarget(fixture, inRangeClassName);

			expect(hasBlanket(target)).toBe(false);
		});

		it('does not paint a highlight band behind the node, so the line height stays its own', () => {
			renderSelectionTarget(fixture, inRangeClassName);
			const wrapper = screen
				.getByTestId('editor-content-container')
				.querySelector(`.${inRangeClassName}`)!;

			expect(hasHighlightBand(wrapper)).toBe(false);
		});

		it('keeps the existing node selection styling when node-selected', () => {
			const target = renderSelectionTarget(fixture, selectedNodeClassName);

			expect(hasBlanket(target)).toBe(fixture.legacyNodeSelection.blanket);
			expect(hasSelectedBackground(target)).toBe(false);
			expect(hasSelectedUnderlay(target)).toBe(false);
			expect(hasTwoPixelRing(target)).toBe(fixture.legacyNodeSelection.twoPixelRing);
		});

		it('keeps the danger styling instead of the selection styling', () => {
			const target = renderSelectionTarget(fixture, `${selectedNodeClassName} danger`);

			expect(hasSelectedBackground(target)).toBe(false);
			expect(hasSelectedUnderlay(target)).toBe(false);
			expect(hasTwoPixelRing(target)).toBe(false);
		});

		it('does not show the selection tint inside a range selection when the editor is not focused', () => {
			const target = renderSelectionTarget(fixture, inRangeClassName, { editorFocused: false });

			expect(hasSelectedBackground(target)).toBe(false);
			expect(hasSelectedUnderlay(target)).toBe(false);
		});
	});

	describe('when the experiment is disabled', () => {
		beforeEach(() => {
			mockExpDisabled(experimentName);
		});

		it('does not show the selection tint inside a range selection', () => {
			const target = renderSelectionTarget(fixture, inRangeClassName);

			expect(hasBlanket(target)).toBe(false);
			expect(hasSelectedBackground(target)).toBe(false);
			expect(hasSelectedUnderlay(target)).toBe(false);
		});

		it('keeps the existing node selection styling', () => {
			const target = renderSelectionTarget(fixture, selectedNodeClassName);

			expect(hasBlanket(target)).toBe(fixture.legacyNodeSelection.blanket);
			expect(hasSelectedBackground(target)).toBe(false);
			expect(hasSelectedUnderlay(target)).toBe(false);
			expect(hasTwoPixelRing(target)).toBe(fixture.legacyNodeSelection.twoPixelRing);
		});
	});
});

describe('inline node selection tint colour', () => {
	afterEach(() => {
		document.documentElement.removeAttribute('data-color-mode');
	});

	describe.each(inlineNodeFixtures)('$name', (fixture) => {
		it.each([
			['inside a range selection', inRangeClassName],
			['when node-selected', selectedNodeClassName],
		])(
			'does not use the system highlight colour, which is too dark to read text on in some browsers, %s',
			(_, className) => {
				mockExpEnabled(experimentName);
				const backgrounds = matchingRules(renderSelectionTarget(fixture, className)).flatMap(
					(rule) => [
						rule.style.getPropertyValue('background-color'),
						rule.style.getPropertyValue('background-image'),
					],
				);

				expect(
					backgrounds.filter((value) =>
						/highlight|--ak-editor-inline-node-selection-tint/iu.test(value),
					),
				).toEqual([]);
			},
		);
	});

	const selectionPseudoElementPattern = /::?selection$/u;
	// `X ::selection` selects text in any descendant of X, so it becomes `X *` for matching.
	const toElementSelector = (selector: string) =>
		selector.replace(/\s+::?selection$/u, ' *').replace(selectionPseudoElementPattern, '');

	/** Whether any rule recolours ordinary document text's native selection highlight. */
	const setsTextSelectionColour = () => {
		render(<EditorContentContainer appearance="full-page">Document</EditorContentContainer>);
		const owner = screen.getAllByTestId('editor-content-container').at(-1)!;
		owner.innerHTML =
			'<div class="ProseMirror"><p><span data-testid="selected-text">Text</span></p></div>';
		const text = owner.querySelector('[data-testid="selected-text"]')!;
		return Array.from(document.styleSheets).some((sheet) =>
			Array.from(sheet.cssRules).some(
				(rule) =>
					rule instanceof CSSStyleRule &&
					!['', 'transparent'].includes(rule.style.getPropertyValue('background-color')) &&
					splitTopLevelSelectors(rule.selectorText).some((selector) => {
						const trimmedSelector = selector.trim();
						return (
							selectionPseudoElementPattern.test(trimmedSelector) &&
							safelyMatches(text, toElementSelector(trimmedSelector))
						);
					}),
			),
		);
	};

	it('keeps the native text selection colour in light and dark mode', () => {
		mockExpEnabled(experimentName);

		expect(setsTextSelectionColour()).toBe(false);
		document.documentElement.setAttribute('data-color-mode', 'dark');
		expect(setsTextSelectionColour()).toBe(false);
	});
});

describe('inline card selection tint transition', () => {
	/** Duration that applies to background-color on the element, from its transition lists. */
	const backgroundColorTransitionDurations = (element: Element) =>
		matchingRules(element).flatMap((rule) => {
			const properties = rule.style
				.getPropertyValue('transition-property')
				.split(',')
				.map((value) => value.trim());
			const durations = rule.style
				.getPropertyValue('transition-duration')
				.split(',')
				.map((value) => value.trim());
			const index = properties.lastIndexOf('background-color');
			return index === -1 ? [] : [durations[index % durations.length]];
		});

	const cardFixture = inlineNodeFixtures.find(({ name }) => name === 'inline card')!;

	it('applies the tint without the card fading it in or out', () => {
		mockExpEnabled(experimentName);
		const target = renderSelectionTarget(cardFixture, '');

		expect(backgroundColorTransitionDurations(target)).toEqual(['0s']);
	});

	it('keeps the card transitions when the experiment is disabled', () => {
		mockExpDisabled(experimentName);
		const target = renderSelectionTarget(cardFixture, '');

		expect(backgroundColorTransitionDurations(target)).toEqual([]);
	});
});

describe('inline card text on the selection tint', () => {
	const cardFixture = inlineNodeFixtures.find(({ name }) => name === 'inline card')!;

	const textColours = (wrapperClassName: string) =>
		matchingRules(renderSelectionTarget(cardFixture, wrapperClassName))
			.map((rule) => rule.style.getPropertyValue('color'))
			.filter(Boolean);

	it('uses the pressed link colour inside a range selection, which keeps 4.5:1 contrast on the tint', () => {
		mockExpEnabled(experimentName);

		expect(
			textColours(inRangeClassName).some((colour) => colour.includes('--ds-link-pressed')),
		).toBe(true);
	});

	it('keeps the link colour when node-selected', () => {
		mockExpEnabled(experimentName);

		expect(
			textColours(selectedNodeClassName).some((colour) => colour.includes('--ds-link-pressed')),
		).toBe(false);
	});
});
