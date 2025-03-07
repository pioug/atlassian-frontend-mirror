import React from 'react';
import { render, screen } from '@testing-library/react';

import { RendererStyleContainer } from '../../RendererStyleContainer';
import { BaseTheme } from '@atlaskit/editor-common/ui';
import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';
import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('RendererStyleContainer', () => {
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

	describe('should have same renderer styles', () => {
		ffTest.on('platform_editor_emotion_refactor_renderer', 'with fg on', () => {
			ffTest.on('platform_editor_typography_ugc', 'with fg on', () => {
				ffTest.on('platform_editor_heading_margin_fix', 'with fg on', () => {
					ffTest.on('editor_inline_comments_on_inline_nodes', 'with fg on', () => {
						ffTest.on('annotations_align_editor_and_renderer_styles', 'with fg on', () => {
							it('should have correct renderer styles', () => {
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
	});
});
