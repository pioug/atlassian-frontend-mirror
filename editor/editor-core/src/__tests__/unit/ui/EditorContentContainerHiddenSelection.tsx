/* eslint-disable @atlaskit/ui-styling-standard/no-classname-prop -- Fixture mirrors ProseMirror and selection-plugin DOM classes. */
import React from 'react';

import { getBrowserInfo } from '@atlaskit/editor-common/browser';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import { EditorContentContainerCompiled } from '../../../ui/EditorContentContainer/EditorContentContainer-compiled';

jest.mock('@atlaskit/editor-common/browser', () => ({
	getBrowserInfo: jest.fn(),
}));

// Both Compiled variants can be emitted. Inspect only styles applied to this container.
const getActiveHighlightSelectors = (pseudo: string): string[] => {
	const container = screen.getByTestId('editor-content-container');
	return Array.from(document.querySelectorAll('style')).flatMap((style) => {
		const selectors: string[] = [];
		for (const match of (style.textContent ?? '').matchAll(/([^{}]+)\{([^{}]*)\}/gu)) {
			const selector = match[1].trim();
			const scope = selector.match(/^\.([\w-]+)\s/u);
			if (
				scope &&
				container.classList.contains(scope[1]) &&
				selector.includes(pseudo) &&
				/background(?:-color)?:\s*transparent/u.test(match[2])
			) {
				selectors.push(selector);
			}
		}
		return selectors;
	});
};

// Compiled normalizes `*::selection` to `::selection`. Restore the universal
// selector when removing a descendant pseudo-element for DOM matching.
const withoutHighlightPseudo = (selector: string, pseudo: string): string =>
	selector.split(` ${pseudo}`).join(' *').split(pseudo).join('');

const renderSelection = () =>
	render(
		<EditorContentContainerCompiled appearance="full-page" viewMode="edit">
			<div className="ProseMirror ProseMirror-hideselection" data-testid="editor">
				<div className="ProseMirror-selectednode" data-testid="pm-node">
					<span data-testid="pm-child">Node view text</span>
				</div>
				<div className="ak-editor-selected-node" data-testid="ak-node">
					<strong data-testid="ak-child">Decorated node text</strong>
				</div>
				<table>
					<tbody>
						<tr>
							<td className="selectedCell" data-testid="cell">
								<p data-testid="cell-child">Selected cell text</p>
							</td>
							<td data-testid="other-cell">Unselected cell text</td>
						</tr>
					</tbody>
				</table>
				<p data-testid="other-paragraph">Unselected paragraph</p>
				<p className="ak-editor-selected-node" data-testid="block-selection">
					<strong data-testid="block-child">Preserved block selection</strong>
				</p>
				<div className="ProseMirror-gapcursor" data-testid="gap-cursor" />
			</div>
		</EditorContentContainerCompiled>,
	);

describe('hidden native selection highlighting', () => {
	beforeEach(() => {
		jest.mocked(getBrowserInfo).mockReturnValue({ chrome_version: 134 });
	});

	afterEach(() => jest.clearAllMocks());

	it('scopes highlighting to selected nodes and cells', () => {
		mockExpEnabled('platform_editor_improve_inp');
		renderSelection();

		for (const pseudo of ['::selection', '::-moz-selection']) {
			const selectors = getActiveHighlightSelectors(pseudo);
			expect(selectors.length).toBeGreaterThan(0);
			expect(selectors.every((selector) => !selector.includes('ProseMirror-hideselection'))).toBe(
				true,
			);
			const isSuppressed = (id: string) =>
				selectors.some((selector) =>
					screen.getByTestId(id).matches(withoutHighlightPseudo(selector, pseudo)),
				);

			for (const id of [
				'pm-node',
				'pm-child',
				'ak-node',
				'ak-child',
				'cell',
				'cell-child',
				'block-selection',
				'block-child',
			]) {
				expect(isSuppressed(id)).toBe(true);
			}
			for (const id of ['other-cell', 'other-paragraph', 'gap-cursor']) {
				expect(isSuppressed(id)).toBe(false);
			}

			// The root class no longer controls highlight suppression.
			screen.getByTestId('editor').classList.remove('ProseMirror-hideselection');
			expect(isSuppressed('pm-child')).toBe(true);
			expect(isSuppressed('cell-child')).toBe(true);
			screen.getByTestId('editor').classList.add('ProseMirror-hideselection');
		}
	});

	it('preserves root-wide suppression in control', () => {
		mockExpDisabled('platform_editor_improve_inp');
		renderSelection();

		for (const pseudo of ['::selection', '::-moz-selection']) {
			const selectors = getActiveHighlightSelectors(pseudo);
			expect(
				selectors.some((selector) =>
					screen.getByTestId('other-paragraph').matches(withoutHighlightPseudo(selector, pseudo)),
				),
			).toBe(true);
		}
	});
});
