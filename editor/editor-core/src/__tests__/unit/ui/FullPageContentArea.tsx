import React from 'react';

import { matchers } from '@emotion/jest';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	__esModule: true,
	default: {
		getExperimentValue: jest.fn().mockReturnValue(false),
		initializeCompleted: jest.fn().mockReturnValue(false),
	},
}));

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn().mockReturnValue(false),
}));

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure', () => ({
	expValEqualsNoExposure: jest.fn().mockReturnValue(false),
}));

// jest doesn't support @container styles in css
jest.mock('@emotion/react', () => {
	const originalModule = jest.requireActual('@emotion/react');
	return {
		...originalModule,
		css: (...args: any[]) => {
			const styles = originalModule.css(...args);
			return {
				...styles,
				// eslint-disable-next-line require-unicode-regexp
				styles: styles.styles.replace(/@container[^{]*{[^{}]*({[^{}]*}[^{}]*)*}/g, ''),
			};
		},
	};
});

import { FullPageContentArea } from '../../../ui/Appearance/FullPage/FullPageContentArea';

expect.extend(matchers);

const mockEditorView = {} as EditorView;

const createMockEditorAPI = (
	allowScrollGutter: unknown,
	markdownModeState?: { isMarkdownMode: boolean; view: 'preview' | 'split-view' | 'syntax' },
) => ({
	base: {
		sharedState: {
			currentState: () => ({ allowScrollGutter }),
		},
	},
	...(markdownModeState
		? {
				markdownMode: {
					sharedState: {
						currentState: () => markdownModeState,
						onChange: () => () => {},
					},
				},
			}
		: {}),
});

const defaultProps = {
	// Use full-width appearance to avoid NaN from theme.layoutMaxWidth
	appearance: 'full-width' as const,
	contentComponents: undefined,
	contentMode: undefined,
	// Provide a stub so ContextPanel (which has its own dependencies) is not rendered
	contextPanel: <div />,
	customContentComponents: undefined,
	disabled: false,
	dispatchAnalyticsEvent: undefined,
	editorActions: undefined,
	editorAPI: undefined,
	editorDOMElement: <div />,
	editorView: mockEditorView,
	eventDispatcher: undefined,
	featureFlags: {},
	pluginHooks: undefined,
	popupsBoundariesElement: undefined,
	popupsMountPoint: undefined,
	popupsScrollableElement: undefined,
	providerFactory: {} as any,
	viewMode: undefined,
	wrapperElement: null,
};

const renderComponent = (props: Partial<typeof defaultProps> = {}) =>
	render(
		<IntlProvider locale="en">
			<FullPageContentArea {...defaultProps} {...props} />
		</IntlProvider>,
	);

const mockFg = fg as jest.MockedFunction<typeof fg>;
const mockExpValEqualsNoExposure = expValEqualsNoExposure as jest.MockedFunction<
	typeof expValEqualsNoExposure
>;

beforeEach(() => {
	mockFg.mockReturnValue(false);
	mockExpValEqualsNoExposure.mockReturnValue(false);
});

describe('accessibility', () => {
	it('should be accessible', async () => {
		const { container } = renderComponent({
			editorAPI: createMockEditorAPI({ gutterSize: 120 }) as any,
		});
		await expect(container).toBeAccessible();
	});
});

describe('FullPageContentArea - scroll gutter rendering', () => {
	it('hides scroll gutters in markdown mode', () => {
		mockExpValEqualsNoExposure.mockReturnValue(true);
		mockFg.mockImplementation((gate) => gate === 'platform_editor_md_mvp_layout');

		renderComponent({
			editorAPI: createMockEditorAPI(
				{ gutterSize: 120 },
				{ isMarkdownMode: true, view: 'syntax' },
			) as any,
		});

		const contentRegion = document.querySelector('[data-markdown-mode-hide-scroll-gutter="true"]');
		const scrollGutter = document.querySelector('[data-vc="scroll-gutter"]');

		expect(contentRegion).toBeInstanceOf(HTMLElement);
		expect(scrollGutter).toBeInstanceOf(HTMLElement);
		if (!(contentRegion instanceof HTMLElement)) {
			throw new Error('Expected content region to be rendered.');
		}
		if (!(scrollGutter instanceof HTMLElement)) {
			throw new Error('Expected scroll gutter to be rendered.');
		}
		expect(contentRegion).toHaveAttribute('data-markdown-mode-hide-scroll-gutter', 'true');
		expect(scrollGutter).toHaveStyleRule('display', 'none');
	});

	it('removes prose width constraints in markdown mode when the MVP layout is active', () => {
		mockExpValEqualsNoExposure.mockReturnValue(true);
		mockFg.mockImplementation((gate) => gate === 'platform_editor_md_mvp_layout');

		renderComponent({
			editorAPI: createMockEditorAPI(
				{ gutterSize: 120 },
				{ isMarkdownMode: true, view: 'syntax' },
			) as any,
		});

		const contentRegion = document.querySelector('.ak-editor-content-area-region');

		expect(contentRegion).toBeInstanceOf(HTMLElement);
		if (!(contentRegion instanceof HTMLElement)) {
			throw new Error('Expected content region to be rendered.');
		}
		expect(contentRegion).toHaveStyleRule('max-width', 'none');
		expect(contentRegion).toHaveStyleRule('width', '100%');
	});

	eeTest.describe('platform_editor_blocks', 'when experiment is enabled').variant(true, () => {
		it('renders scroll gutter with data-editor-scroll-gutter attribute', () => {
			renderComponent({ editorAPI: createMockEditorAPI({ gutterSize: 120 }) as any });
			expect(document.querySelector('[data-editor-scroll-gutter]')).toBeTruthy();
		});

		it('does not render scroll gutter when allowScrollGutter is falsy', () => {
			renderComponent({ editorAPI: undefined });
			expect(document.querySelector('[data-editor-scroll-gutter]')).toBeNull();
		});
	});

	eeTest.describe('platform_editor_blocks', 'when experiment is disabled').variant(false, () => {
		it('renders scroll gutter without data-editor-scroll-gutter attribute', () => {
			renderComponent({ editorAPI: createMockEditorAPI({ gutterSize: 120 }) as any });
			const gutter = document.querySelector('#editor-scroll-gutter');
			expect(gutter).toBeTruthy();
			expect(gutter?.getAttribute('data-editor-scroll-gutter')).toBeNull();
		});

		it('does not render scroll gutter when allowScrollGutter is falsy', () => {
			renderComponent({ editorAPI: undefined });
			expect(document.querySelector('#editor-scroll-gutter')).toBeNull();
		});
	});
});
