import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import FeatureGates from '@atlaskit/feature-gate-js-client';

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

jest.mock('@atlaskit/tmp-editor-statsig/experiments', () => ({
	editorExperiment: jest.fn().mockReturnValue(false),
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

const mockEditorView = {} as EditorView;

const createMockEditorAPI = (allowScrollGutter: unknown) => ({
	base: {
		sharedState: {
			currentState: () => ({ allowScrollGutter }),
		},
	},
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

describe('accessibility', () => {
	it('should be accessible', async () => {
		const { container } = renderComponent({
			editorAPI: createMockEditorAPI({ gutterSize: 120 }) as any,
		});
		await expect(container).toBeAccessible();
	});
});

describe('FullPageContentArea - scroll gutter rendering', () => {
	afterEach(() => {
		(FeatureGates.getExperimentValue as jest.Mock).mockReturnValue(false);
	});

	describe('when experiment cc_snippets_dogfooding_beta is enabled', () => {
		beforeEach(() => {
			(FeatureGates.getExperimentValue as jest.Mock).mockReturnValue(true);
		});

		it('renders scroll gutter with data-editor-scroll-gutter attribute', () => {
			renderComponent({ editorAPI: createMockEditorAPI({ gutterSize: 120 }) as any });
			expect(document.querySelector('[data-editor-scroll-gutter]')).toBeTruthy();
		});

		it('does not render scroll gutter when allowScrollGutter is falsy', () => {
			renderComponent({ editorAPI: undefined });
			expect(document.querySelector('[data-editor-scroll-gutter]')).toBeNull();
		});
	});

	describe('when experiment cc_snippets_dogfooding_beta is disabled', () => {
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
