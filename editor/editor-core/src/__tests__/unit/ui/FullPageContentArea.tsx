import React from 'react';

import { IntlProvider } from 'react-intl';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { render } from '@atlassian/testing-library/testing-library/react';

jest.mock('@atlaskit/feature-gate-js-client/feature-gates', () => ({
	...jest.requireActual('@atlaskit/feature-gate-js-client/feature-gates'),
	__esModule: true,
	default: {
		getExperimentValue: jest.fn().mockReturnValue(false),
		initializeCompleted: jest.fn().mockReturnValue(false),
	},
}));

jest.mock('@atlaskit/platform-feature-flags/fg', () => ({
	...jest.requireActual('@atlaskit/platform-feature-flags/fg'),
	fg: jest.fn().mockReturnValue(false),
}));

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure', () => ({
	expValEqualsNoExposure: jest.fn().mockReturnValue(false),
}));

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

const removeContainerQueryStyles = () => {
	document.querySelectorAll('style').forEach((style) => {
		if (style.textContent?.includes('@container')) {
			// jest's CSS parser used by toHaveCompiledCss does not support @container yet.
			// Remove only the unsupported container query block while preserving the rest of
			// the compiled style tag for assertions in this test.
			style.textContent = style.textContent.replace(
				/@container[^{]*\{[^{}]*(\{[^{}]*\}[^{}]*)*\}/gu,
				'',
			);
		}
	});
};

const renderComponent = (props: Partial<typeof defaultProps> = {}) => {
	const result = render(
		<IntlProvider locale="en">
			{/* eslint-disable-next-line react/jsx-props-no-spreading */}
			<FullPageContentArea {...defaultProps} {...props} />
		</IntlProvider>,
	);
	removeContainerQueryStyles();
	return result;
};

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
	it('renders scroll gutter with data-editor-scroll-gutter attribute', () => {
		renderComponent({ editorAPI: createMockEditorAPI({ gutterSize: 120 }) as any });
		expect(document.querySelector('[data-editor-scroll-gutter]')).toBeTruthy();
	});

	it('does not render scroll gutter when allowScrollGutter is falsy', () => {
		renderComponent({ editorAPI: undefined });
		expect(document.querySelector('[data-editor-scroll-gutter]')).toBeNull();
	});
});
