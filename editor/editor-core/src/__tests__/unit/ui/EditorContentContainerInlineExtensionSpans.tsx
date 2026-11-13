/* eslint-disable @atlaskit/ui-styling-standard/no-classname-prop -- Fixture mirrors the task item and inline extension node view DOM. */
import React from 'react';

import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import EditorContentContainer from '../../../ui/EditorContentContainer/EditorContentContainer';

const EXPERIMENT = 'platform_editor_inline_extension_spans';

type StyleRule = { order: number; selector: string; value: string };

// Splits a selector list on commas outside parentheses, so `:is(a, b)` stays whole.
const splitSelectorList = (list: string): string[] => {
	const parts: string[] = [];
	let depth = 0;
	let current = '';
	for (const char of list) {
		depth += char === '(' ? 1 : char === ')' ? -1 : 0;
		if (char === ',' && depth === 0) {
			parts.push(current.trim());
			current = '';
		} else {
			current += char;
		}
	}
	return [...parts, current.trim()];
};

const matchesSelector = (element: Element, selector: string): boolean => {
	try {
		return element.matches(selector);
	} catch {
		// jsdom cannot parse some unrelated selectors in the sheet.
		return false;
	}
};

// Compiled emits every style variant. Keep only rules scoped to a class on this container.
const getAppliedRules = (property: string): StyleRule[] => {
	const container = screen.getByTestId('editor-content-container');
	const declaration = new RegExp(`(?:^|;)\\s*${property}:\\s*([^;]+)`, 'u');
	const rules: StyleRule[] = [];
	for (const style of Array.from(document.querySelectorAll('style'))) {
		for (const match of (style.textContent ?? '').matchAll(/([^{}]+)\{([^{}]*)\}/gu)) {
			const value = match[2].match(declaration);
			if (!value) {
				continue;
			}
			for (const selector of splitSelectorList(match[1])) {
				const scope = selector.match(/^\.([\w-]+)\s/u);
				if (scope && container.classList.contains(scope[1])) {
					rules.push({ order: rules.length, selector, value: value[1].trim() });
				}
			}
		}
	}
	return rules;
};

// Enough of https://www.w3.org/TR/selectors-4/#specificity for these simple selectors.
const specificity = (selector: string): [number, number, number] => {
	const withoutAttributes = selector.replace(/\[[^\]]*\]/gu, () => ' .attr ');
	const ids = (withoutAttributes.match(/#[\w-]+/gu) ?? []).length;
	const classes = (withoutAttributes.match(/\.[\w-]+|:[\w-]+/gu) ?? []).length;
	const types = withoutAttributes
		.replace(/[.#:][\w-]+/gu, ' ')
		.split(/[\s>+~]+/u)
		.filter((part) => /^[a-z]/iu.test(part)).length;
	return [ids, classes, types];
};

const compare = (a: StyleRule, b: StyleRule): number => {
	const [sa, sb] = [specificity(a.selector), specificity(b.selector)];
	for (let i = 0; i < 3; i++) {
		if (sa[i] !== sb[i]) {
			return sa[i] - sb[i];
		}
	}
	return a.order - b.order;
};

const getWinningValue = (testId: string, property: string): string | undefined => {
	const element = screen.getByTestId(testId);
	const matching = getAppliedRules(property).filter((rule) =>
		matchesSelector(element, rule.selector),
	);
	return matching.sort(compare).pop()?.value;
};

// Inline extension node view with a span label container, as editor-common renders it with the
// experiment on.
const InlineExtension = ({ labelTestId }: { labelTestId: string }) => (
	<span className="inlineExtensionView-content-wrap" contentEditable={false}>
		<span className="inline-extension relative" data-testid="extension-node-wrapper">
			<span contentEditable={false} data-testid={labelTestId} />
			<span className="extension-container inline" data-testid="inline-extension-wrapper" />
		</span>
	</span>
);

const renderTaskWithInlineExtension = () =>
	render(
		<EditorContentContainer appearance="full-page" viewMode="edit">
			<div className="ProseMirror">
				<div className="taskItemView-content-wrap">
					<div data-task-local-id="task-1" data-prosemirror-node-name="taskItem">
						<div data-component="task-item-main">
							<span
								contentEditable={false}
								className="task-item-checkbox-wrap"
								data-component="task-item-input-wrap"
								data-testid="task-checkbox"
							/>
							<span
								contentEditable={false}
								data-component="placeholder"
								data-testid="task-placeholder"
							/>
							<div data-component="content">
								<div className="task-item">
									before <InlineExtension labelTestId="task-label-container" /> after
								</div>
							</div>
						</div>
					</div>
				</div>
				<p>
					before <InlineExtension labelTestId="paragraph-label-container" /> after
				</p>
			</div>
		</EditorContentContainer>,
	);

// Selected inline extensions with either label container tag.
const renderSelectedInlineExtensions = () =>
	render(
		<EditorContentContainer appearance="full-page" viewMode="edit">
			<div className="ProseMirror">
				<div>
					<span className="inlineExtensionView-content-wrap ak-editor-selected-node">
						<span>
							<div>
								<span className="extension-label" data-testid="div-container-label" />
							</div>
						</span>
					</span>
					<span className="inlineExtensionView-content-wrap ak-editor-selected-node">
						<span>
							<span>
								<span className="extension-label" data-testid="span-container-label" />
							</span>
						</span>
					</span>
				</div>
			</div>
		</EditorContentContainer>,
	);

describe('EditorContentContainer inline extension span label container', () => {
	it('does not give the label container a task height with the experiment on', () => {
		mockExpEnabled(EXPERIMENT);
		renderTaskWithInlineExtension();

		expect(getWinningValue('task-label-container', 'height')).toBeUndefined();
	});

	it('keeps the task checkbox and placeholder heights with the experiment on', () => {
		mockExpEnabled(EXPERIMENT);
		renderTaskWithInlineExtension();

		expect(getWinningValue('task-checkbox', 'height')).toBe('1.714em');
		expect(getWinningValue('task-placeholder', 'height')).toBe('1.714em');
	});

	it('does not set a height on the label container outside a task item', () => {
		mockExpEnabled(EXPERIMENT);
		renderTaskWithInlineExtension();

		expect(getWinningValue('paragraph-label-container', 'height')).toBeUndefined();
	});

	it('keeps the broad task height selector with the experiment off', () => {
		mockExpDisabled(EXPERIMENT);
		renderTaskWithInlineExtension();

		expect(getWinningValue('task-label-container', 'height')).toBe('1.714em');
		expect(getWinningValue('task-checkbox', 'height')).toBe('1.714em');
	});

	it('styles only the span label container as selected with the experiment on', () => {
		mockExpEnabled(EXPERIMENT);
		renderSelectedInlineExtensions();

		expect(getWinningValue('span-container-label', 'background-color')).toMatch(
			/background-selected/u,
		);
		expect(getWinningValue('div-container-label', 'background-color')).toBeUndefined();
	});

	it('styles only the div label container as selected with the experiment off', () => {
		mockExpDisabled(EXPERIMENT);
		renderSelectedInlineExtensions();

		expect(getWinningValue('div-container-label', 'background-color')).toMatch(
			/background-selected/u,
		);
		expect(getWinningValue('span-container-label', 'background-color')).toBeUndefined();
	});
});
