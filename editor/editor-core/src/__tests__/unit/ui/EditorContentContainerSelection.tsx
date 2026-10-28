import React from 'react';

import { getBrowserInfo } from '@atlaskit/editor-common/browser';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { wasExperimentExposed } from '@atlassian/experiment-test-utils/was-experiment-exposed';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import EditorContentContainer from '../../../ui/EditorContentContainer/EditorContentContainer';

jest.mock('@atlaskit/editor-common/browser', () => ({
	getBrowserInfo: jest.fn(),
}));

const mockGetBrowserInfo = jest.mocked(getBrowserInfo);

// Inspect only rules whose scoped class is applied to this container. Compiled can
// emit both variants into the stylesheet even when only one variant is active.
const getActiveSelectedNodeSelectors = (): string[] => {
	const container = screen.getByTestId('editor-content-container');
	return Array.from(document.querySelectorAll('style')).flatMap((style) => {
		const selectors: string[] = [];
		for (const match of (style.textContent ?? '').matchAll(/([^{}]+)\{[^{}]*\}/gu)) {
			const selector = match[1].trim();
			const scope = selector.match(/^\.([\w-]+)\s+\.ProseMirror/u);
			if (
				scope &&
				container.classList.contains(scope[1]) &&
				(selector.includes(':is(p,') || selector.includes(':is(ul,')) &&
				selector.includes('::selection')
			) {
				selectors.push(selector);
			}
		}
		return selectors;
	});
};

const renderContainer = () =>
	render(
		<EditorContentContainer appearance="full-page" viewMode="edit">
			<p>Text with nested formatting</p>
		</EditorContentContainer>,
	);

describe('selected-node highlight inheritance', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('keeps descendant selection rules in the experiment control', () => {
		mockExpDisabled('platform_editor_improve_inp');
		mockGetBrowserInfo.mockReturnValue({ chrome_version: 134 });
		renderContainer();
		expect(wasExperimentExposed('platform_editor_improve_inp')).toBe(true);

		expect(getActiveSelectedNodeSelectors()).toEqual(
			expect.arrayContaining([expect.stringMatching(/\s+(?:\*)?::selection/u)]),
		);
	});

	it('keeps the parent highlight and omits descendant rules in Chromium 134+', async () => {
		mockExpEnabled('platform_editor_improve_inp');
		mockGetBrowserInfo.mockReturnValue({ chrome_version: 134 });
		renderContainer();
		expect(wasExperimentExposed('platform_editor_improve_inp')).toBe(true);

		const selectors = getActiveSelectedNodeSelectors();
		expect(selectors.length).toBeGreaterThanOrEqual(2);
		expect(selectors.every((selector) => !/\s+(?:\*)?::selection/u.test(selector))).toBe(true);
		await expect(document.body).toBeAccessible();
	});

	it.each([
		['older Chromium', { chrome_version: 133 }],
		['Firefox', { gecko: true, chrome_version: Number.NaN }],
		['Safari', { safari: true, chrome_version: Number.NaN }],
		['unknown browser / SSR', { chrome_version: 0 }],
	])('keeps descendant rules for %s even in the experiment treatment', (_name, browser) => {
		mockExpEnabled('platform_editor_improve_inp');
		mockGetBrowserInfo.mockReturnValue(browser);
		renderContainer();

		expect(getActiveSelectedNodeSelectors()).toEqual(
			expect.arrayContaining([expect.stringMatching(/\s+(?:\*)?::selection/u)]),
		);
	});
});
