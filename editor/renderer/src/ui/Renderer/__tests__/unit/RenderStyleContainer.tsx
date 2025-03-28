import React from 'react';
import { render, screen } from '@testing-library/react';

import { RendererStyleContainer } from '../../RendererStyleContainer';
import { BaseTheme } from '@atlaskit/editor-common/ui';
import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { setGlobalTheme } from '@atlaskit/tokens';

describe('RendererStyleContainer', () => {
	beforeEach(() => {
		setGlobalTheme({ typography: 'typography-modernized' });
	});

	ffTest.on('platform_editor_emotion_refactor_renderer', 'with fg on', () => {
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
	});

	/**
	 * Skip this test as it passes locally but fails on CI
	 * Could be caused by the difference in the environment, or emotion generate random ids when running in pipeline.
	 * Ticket created for refactor this test: https://product-fabric.atlassian.net/browse/ED-27318
	 */
	describe('should have same renderer styles', () => {
		ffTest.on('platform_editor_emotion_refactor_renderer', 'with fg on', () => {
			ffTest.on('platform_editor_typography_ugc', 'with fg on', () => {
				ffTest.on('editor_inline_comments_on_inline_nodes', 'with fg on', () => {
					ffTest.on('annotations_align_editor_and_renderer_styles', 'with fg on', () => {
						it.skip('should have correct renderer styles', () => {
							render(
								<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
									<RendererStyleContainer
										appearance="full-page"
										testId="testRendererEmotionRefactored"
										allowNestedHeaderLinks={false}
										useBlockRenderForCodeBlock={false}
									>
										<div>Hello world Emotion Refactored</div>
									</RendererStyleContainer>
								</BaseTheme>,
							);
							expect(screen.getByTestId('testRendererEmotionRefactored')).toMatchSnapshot();
						});
					});
				});
			});
		});
	});

	describe('when platform_editor_emotion_refactor_renderer and platform_editor_typography_ugc are on', () => {
		ffTest.on('platform_editor_emotion_refactor_renderer', 'with fg on', () => {
			ffTest.on('platform_editor_typography_ugc', 'with fg on', () => {
				it('should keep the editor visual refresh headings and paragraph styles', async () => {
					render(
						<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
							<RendererStyleContainer
								appearance="full-page"
								allowNestedHeaderLinks={false}
								useBlockRenderForCodeBlock={false}
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

					[1, 2, 3, 4, 5, 6].forEach((index) => {
						expect(screen.getByText(`Heading ${index}`)).toHaveStyle(
							`font:var(--ak-renderer-editor-font-heading-h${index})`,
						);
					});
					expect(screen.getByText(`paragraph`)).toHaveStyle(
						`font:var(--ak-renderer-editor-font-normal-text)`,
					);
				});
			});
		});
	});
});
