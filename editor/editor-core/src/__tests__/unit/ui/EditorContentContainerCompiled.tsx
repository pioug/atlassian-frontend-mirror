/* eslint-disable @atlaskit/ui-styling-standard/no-classname-prop */
import React from 'react';

import { render, screen } from '@testing-library/react';

import { BaseTheme } from '@atlaskit/editor-common/ui';
import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { setGlobalTheme } from '@atlaskit/tokens/set-global-theme';
jest.mock('@atlaskit/platform-feature-flags', () => ({
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
});
