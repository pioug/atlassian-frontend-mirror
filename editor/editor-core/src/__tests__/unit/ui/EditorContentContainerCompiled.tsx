/* eslint-disable @atlaskit/ui-styling-standard/no-classname-prop */
import React from 'react';

import { render, screen } from '@testing-library/react';

import { BaseTheme } from '@atlaskit/editor-common/ui';
import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { setGlobalTheme } from '@atlaskit/tokens/set-global-theme';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
jest.mock('@atlaskit/platform-feature-flags/fg', () => ({
	...jest.requireActual('@atlaskit/platform-feature-flags/fg'),
	fg: jest.fn(),
}));
const fgMock = fg as jest.Mock;

import { EditorContentContainerCompiled } from '../../../ui/EditorContentContainer/EditorContentContainer-compiled';

// this test is mainly to check if dev only updated legacy styles, and forget to update in the new styles
// if the new styles are not updated, we will see a difference in the snapshot
// and dev should update the new styles, and then update the snapshot
describe('Editor Content styles', () => {
	beforeEach(() => {
		setGlobalTheme({ typography: 'typography' });
		fgMock.mockReturnValue(true);
	});

	afterEach(() => {
		setupEditorExperiments('test', {});
		jest.clearAllMocks();
	});

	describe('full page editor', () => {
		it('should render scroll container styles in new editor styles', async () => {
			render(
				<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
					<EditorContentContainerCompiled
						appearance="full-page"
						className="fabric-editor-popup-scroll-parent"
						viewMode={'edit'}
						isScrollable
					>
						<div data-testid="child-component">Full page</div>
					</EditorContentContainerCompiled>
				</BaseTheme>,
			);

			const results = screen.getByTestId('editor-content-container');
			expect(results).toBeInTheDocument();
			expect(results).toHaveStyle({
				'flex-grow': '1',
				height: '100%',
				'overflow-y': 'scroll',
				position: 'relative',
				display: 'flex',
				'flex-direction': 'column',
				'scroll-behavior': 'smooth',
			});

			await expect(document.body).toBeAccessible();
		});
	});

	describe('platform_editor_table_css_overflow_shadow: enabled', () => {
		it('renders the table overflow shadow styles from the editor content container', () => {
			mockExpEnabled('platform_editor_table_css_overflow_shadow');

			render(
				<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
					<EditorContentContainerCompiled appearance="full-page" viewMode="edit">
						<div className="ProseMirror">
							<div className="pm-table-container">
								<div className="pm-table-wrapper pm-table-scroll-inline-shadow" />
								<div data-testid="table-overflow-shadow" data-table-overflow-shadow="start" />
							</div>
						</div>
					</EditorContentContainerCompiled>
				</BaseTheme>,
			);

			expect(screen.getByTestId('table-overflow-shadow')).toHaveStyle({
				opacity: '0',
				'pointer-events': 'none',
				position: 'absolute',
			});
		});
	});

	describe('content-mode table extension containment', () => {
		const renderExtensionInContentModeTable = () =>
			render(
				<EditorContentContainerCompiled appearance="full-page" viewMode="edit">
					<div className="ProseMirror">
						<table data-initial-width-mode="content">
							<tbody>
								<tr>
									<td>
										<div className="extension-overflow-wrapper" data-testid="extension-wrapper" />
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</EditorContentContainerCompiled>,
			);

		it('removes inline-size containment from extensions in content-mode tables', () => {
			renderExtensionInContentModeTable();

			expect(getComputedStyle(screen.getByTestId('extension-wrapper')).containerType).toBe(
				'normal',
			);
		});
	});

	eeTest
		.describe('editor_tinymce_full_width_mode', 'when max width mode feature is enabled')
		.variant(true, () => {
			eeTest
				.describe(
					'confluence_max_width_content_appearance',
					'when max width mode feature is enabled',
				)
				.variant(true, () => {
					describe('max width editor', () => {
						it('should render scroll container styles in new editor styles', async () => {
							render(
								<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
									<EditorContentContainerCompiled
										appearance="max"
										className="fabric-editor-popup-scroll-parent"
										viewMode={'edit'}
										isScrollable
									>
										<div data-testid="child-component">Full page</div>
									</EditorContentContainerCompiled>
								</BaseTheme>,
							);

							const results = screen.getByTestId('editor-content-container');
							expect(results).toBeInTheDocument();
							expect(results).toHaveStyle({
								'flex-grow': '1',
								height: '100%',
								'overflow-y': 'scroll',
								position: 'relative',
								display: 'flex',
								'flex-direction': 'column',
								'scroll-behavior': 'smooth',
							});

							await expect(document.body).toBeAccessible();
						});
					});
				});
		});

	describe('comment editor', () => {
		it('should render comment specific styles in new editor styles', async () => {
			render(
				<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
					<EditorContentContainerCompiled
						appearance="comment"
						className="fabric-editor-popup-scroll-parent"
						viewMode={'edit'}
						isScrollable
					>
						<div data-testid="child-component" className="ProseMirror">
							Comment
							<div className="pm-table-wrapper">
								<table data-testid="table-test">
									<tbody>
										<tr>
											<td>test</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</EditorContentContainerCompiled>
				</BaseTheme>,
			);

			const results = screen.getByTestId('editor-content-container');
			expect(results).toBeInTheDocument();
			expect(results).toHaveStyle({
				'flex-grow': '1',
				'overflow-x': 'clip',
				'line-height': '24px',
			});

			const tableElement = screen.getByTestId('table-test');
			expect(tableElement).toBeInTheDocument();
			expect(tableElement).toHaveStyle({
				'margin-left': 0,
				'margin-right': 0,
			});
			await expect(document.body).toBeAccessible();
		});
	});

	describe('platform_editor_floating_toc: disabled', () => {
		it('does not apply heading scroll margin', () => {
			mockExpDisabled('platform_editor_floating_toc');

			render(
				<EditorContentContainerCompiled appearance="full-page" viewMode="edit">
					<div className="ProseMirror">
						<h1>Heading 1</h1>
					</div>
				</EditorContentContainerCompiled>,
			);

			expect(window.getComputedStyle(screen.getByRole('heading')).scrollMarginTop).toBe('');
		});

		it('retains emoji selection styles inherited from a selected parent', () => {
			mockExpDisabled('platform_editor_floating_toc');

			render(
				<EditorContentContainerCompiled appearance="full-page" viewMode="edit">
					<div className="ProseMirror">
						<div className="ak-editor-selected-node">
							<span data-emoji-id="nested-emoji">
								<span className="emojiView-content-wrap">
									<span className="emoji-common-emoji-image" data-testid="nested-emoji-image" />
								</span>
							</span>
						</div>
					</div>
				</EditorContentContainerCompiled>,
			);

			expect(window.getComputedStyle(screen.getByTestId('nested-emoji-image')).position).toBe(
				'relative',
			);
		});
	});
});

describe('platform_editor_floating_toc: enabled', () => {
	it('applies scroll margin to every heading level', () => {
		mockExpEnabled('platform_editor_floating_toc');

		render(
			<EditorContentContainerCompiled appearance="full-page" viewMode="edit">
				<div className="ProseMirror">
					<h1>Heading 1</h1>
					<h2>Heading 2</h2>
					<h3>Heading 3</h3>
					<h4>Heading 4</h4>
					<h5>Heading 5</h5>
					<h6>Heading 6</h6>
				</div>
			</EditorContentContainerCompiled>,
		);

		screen.getAllByRole('heading').forEach((heading) => {
			expect(window.getComputedStyle(heading).scrollMarginTop).toMatch(
				/^var\(--ds-space-300,\s?24px\)$/u,
			);
		});
	});

	it('applies emoji selection styles only when the emoji node itself is selected', () => {
		mockExpEnabled('platform_editor_floating_toc');

		render(
			<EditorContentContainerCompiled appearance="full-page" viewMode="edit">
				<div className="ProseMirror">
					<span className="ak-editor-selected-node" data-emoji-id="selected-emoji">
						<span className="emojiView-content-wrap">
							<span className="emoji-common-emoji-image" data-testid="selected-emoji-image" />
						</span>
					</span>
					<div className="ak-editor-selected-node">
						<span data-emoji-id="nested-emoji">
							<span className="emojiView-content-wrap">
								<span className="emoji-common-emoji-image" data-testid="nested-emoji-image" />
							</span>
						</span>
					</div>
				</div>
			</EditorContentContainerCompiled>,
		);

		expect(window.getComputedStyle(screen.getByTestId('selected-emoji-image')).position).toBe(
			'relative',
		);
		expect(window.getComputedStyle(screen.getByTestId('nested-emoji-image')).position).toBe('');
	});
});
