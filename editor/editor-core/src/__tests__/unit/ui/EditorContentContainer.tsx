import React from 'react';

import { render, screen } from '@testing-library/react';

import { BaseTheme } from '@atlaskit/editor-common/ui';
import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { setGlobalTheme } from '@atlaskit/tokens';
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));
const fgMock = fg as jest.Mock;

import { ContentArea } from '../../../ui/Appearance/Chromeless';
import EditorContentContainer from '../../../ui/EditorContentContainer/EditorContentContainer';

// jest doesn't support @container styles in css
// so we need to mock the css function to remove them
jest.mock('@emotion/react', () => {
	const originalModule = jest.requireActual('@emotion/react');
	return {
		...originalModule,
		css: (...args: any[]) => {
			const styles = originalModule.css(...args);
			// Remove or mock @container styles
			return {
				...styles,
				// eslint-disable-next-line require-unicode-regexp
				styles: styles.styles.replace(/@container[^{]*{[^{}]*({[^{}]*}[^{}]*)*}/g, ''),
			};
		},
	};
});

// this test is mainly to check if dev only updated legacy styles, and forget to update in the new styles
// if the new styles are not updated, we will see a difference in the snapshot
// and dev should update the new styles, and then update the snapshot
describe('Editor Content styles', () => {
	beforeEach(() => {
		setGlobalTheme({ typography: 'typography-modernized' });
		fgMock.mockReturnValue(true);
	});

	afterEach(() => {
		setupEditorExperiments('test', {});
		jest.clearAllMocks();
	});

	// chromeless editor used the base styles, so we used this as main test to check legacy and new styles are matching
	describe('chromeless editor', () => {
		// new editor content styles WIP under the editor experiment platform_editor_core_static_emotion
		it('renders correct styles for new editor content styles for chromeless editor with experiments on', () => {
			setupEditorExperiments('test', {
				advanced_layouts: true,
				platform_editor_vanilla_dom: true,
				platform_editor_breakout_resizing: true,
				platform_editor_advanced_code_blocks: true,
				platform_editor_controls: 'variant1',
			});
			render(
				<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
					<EditorContentContainer
						appearance="chromeless"
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
						className="fabric-editor-popup-scroll-parent"
						// featureFlags={}
						viewMode={'edit'}
						isScrollable
					>
						<div data-testid="child-component">Chromeless</div>
					</EditorContentContainer>
				</BaseTheme>,
			);

			const results = screen.getByTestId('editor-content-container');
			expect(results).toBeInTheDocument();
			expect(results).toMatchSnapshot('new styles with experiments on');
		});

		// new editor content styles WIP under the editor experiment platform_editor_core_static_emotion
		it('renders correct styles for new editor content styles for chromeless editor', () => {
			render(
				<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
					<EditorContentContainer
						appearance="chromeless"
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
						className="fabric-editor-popup-scroll-parent"
						// featureFlags={}
						viewMode={'edit'}
						isScrollable
					>
						<div data-testid="child-component">Chromeless</div>
					</EditorContentContainer>
				</BaseTheme>,
			);

			const results = screen.getByTestId('editor-content-container');
			expect(results).toBeInTheDocument();
			expect(results).toMatchSnapshot('new styles');
		});

		// legacy editor content styles
		it('renders correct styles for legacy editor content styles for chromeless editor with experiments on', async () => {
			setupEditorExperiments('test', {
				advanced_layouts: true,
				platform_editor_vanilla_dom: true,
				platform_editor_breakout_resizing: true,
				platform_editor_advanced_code_blocks: true,
				platform_editor_controls: 'variant1',
			});
			render(
				<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
					<ContentArea>
						<div data-testid="child-component">Chromeless</div>
					</ContentArea>
				</BaseTheme>,
			);

			const results = screen.getByTestId('editor-content-container');
			expect(results).toBeInTheDocument();
			expect(results).toMatchSnapshot();
		});

		// legacy editor content styles
		it('renders correct styles for legacy editor content styles for chromeless editor', async () => {
			render(
				<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
					<ContentArea>
						<div data-testid="child-component">Chromeless</div>
					</ContentArea>
				</BaseTheme>,
			);

			const results = screen.getByTestId('editor-content-container');
			expect(results).toBeInTheDocument();
			expect(results).toMatchSnapshot();
		});
	});

	describe('full page editor', () => {
		it('should render scroll container styles in new editor styles', () => {
			render(
				<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
					<EditorContentContainer
						appearance="full-page"
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
						className="fabric-editor-popup-scroll-parent"
						// featureFlags={}
						viewMode={'edit'}
						isScrollable
					>
						<div data-testid="child-component">Full page</div>
					</EditorContentContainer>
				</BaseTheme>,
			);

			const results = screen.getByTestId('editor-content-container');
			expect(results).toBeInTheDocument();
			expect(results).toHaveCompiledCss({
				flexGrow: '1',
				height: '100%',
				overflowY: 'scroll',
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				scrollBehavior: 'smooth',
				// style from scrollbarStyles
				'-ms-overflow-style': '-ms-autohiding-scrollbar',
			});
		});
	});

	describe('comment editor', () => {
		it('should render comment specific styles in new editor styles', () => {
			render(
				<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
					<EditorContentContainer
						appearance="comment"
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
						className="fabric-editor-popup-scroll-parent"
						// featureFlags={}
						viewMode={'edit'}
						isScrollable
					>
						<div data-testid="child-component">Comment</div>
					</EditorContentContainer>
				</BaseTheme>,
			);

			const results = screen.getByTestId('editor-content-container');
			expect(results).toBeInTheDocument();
			expect(results).toHaveCompiledCss({
				flexGrow: '1',
				overflowX: 'clip',
				lineHeight: '24px',
			});

			// Check for tableCommentEditorStyles
			const emotionStyles = Array.from(document.querySelectorAll('style[data-emotion]')).map(
				(el) => el.textContent,
			);
			const tableCommentEditorEmotionStyles: string[] = [];
			emotionStyles.forEach((es) => {
				if (es?.includes('.ProseMirror .pm-table-wrapper>table')) {
					tableCommentEditorEmotionStyles.push(es);
				}
			});
			expect(tableCommentEditorEmotionStyles.length).toBeGreaterThan(0);
			expect(tableCommentEditorEmotionStyles[0]).toContain(
				'margin-left:0;margin-right:0;-ms-overflow-style:-ms-autohiding-scrollbar;',
			);
		});
	});
});
