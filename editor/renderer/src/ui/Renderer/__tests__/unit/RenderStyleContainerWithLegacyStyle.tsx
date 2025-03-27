import React from 'react';
import { render, screen } from '@testing-library/react';

import { RendererStyleContainer } from '../../RendererStyleContainer';
import { BaseTheme } from '@atlaskit/editor-common/ui';
import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';
import { ffTest } from '@atlassian/feature-flags-test-utils';

// The legacy emotion styles are dynamic, and used tag template styles, and have feature flags and experiments inside css
// The refactored styles are static, and use css prop styles, and have feature flags and experiments outside css
// The refactored styles are more performant and have better performance
// The refactored styles tests are in packages/editor/renderer/src/ui/Renderer/__tests__/unit/RenderStyleContainer.tsx
// The separation of tests are for easier comparison between the snapshots of the legacy and refactored styles
describe('RendererStyleContainer with legacy emotion styles', () => {
	ffTest.off('platform_editor_emotion_refactor_renderer', 'with fg off', () => {
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
		ffTest.off('platform_editor_emotion_refactor_renderer', 'with fg off', () => {
			ffTest.on('platform_editor_typography_ugc', 'with fg on', () => {
				ffTest.on('editor_inline_comments_on_inline_nodes', 'with fg on', () => {
					ffTest.on('annotations_align_editor_and_renderer_styles', 'with fg on', () => {
						it.skip('should have correct renderer styles before refactor', () => {
							render(
								<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
									<RendererStyleContainer
										appearance="full-page"
										testId="testRendererEmotion"
										allowNestedHeaderLinks={false}
										useBlockRenderForCodeBlock={false}
									>
										<div>Hello world Emotion</div>
									</RendererStyleContainer>
								</BaseTheme>,
							);
							// If the snapshot fails, it means the styles have changed
							// Please update the snapshot and git diff to see the changes
							// and then apply the changes to the new renderer styles in packages/editor/renderer/src/ui/Renderer/RendererStyleContainer.tsx
							// and update the snapshots of packages/editor/renderer/src/ui/Renderer/__tests__/unit/RenderStyleContainer.tsx
							expect(screen.getByTestId('testRendererEmotion')).toMatchSnapshot();
						});
					});
				});
			});
		});
	});
});
