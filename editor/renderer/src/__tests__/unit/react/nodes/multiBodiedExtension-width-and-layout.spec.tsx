/* eslint-disable @atlaskit/editor/no-as-casting, react/jsx-props-no-spreading */
import React from 'react';
import { render, screen } from '@testing-library/react';

import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import MultiBodiedExtension from '../../../../react/nodes/multiBodiedExtension';
import { useMultiBodiedExtensionContext } from '../../../../react/nodes/multiBodiedExtension/context';
import { useMultiBodiedExtensionActions } from '../../../../react/nodes/multiBodiedExtension/actions';
import { calcBreakoutWidthCss } from '../../../../react/utils/breakout';
import { RendererCssClassName } from '../../../../consts';

jest.mock('@atlaskit/editor-common/ui', () => ({
	...jest.requireActual('@atlaskit/editor-common/ui'),
	WidthConsumer: ({ children }: any) => children({ width: 800 }),
}));

jest.mock('@atlaskit/editor-common/utils', () => ({
	...jest.requireActual('@atlaskit/editor-common/utils'),
	calcBreakoutWidth: jest.fn((layout: string) => {
		if (layout === 'wide') {
			return '960px';
		}
		if (layout === 'full-width') {
			return '1800px';
		}
		return '100%';
	}),
}));

jest.mock('../../../../react/nodes/multiBodiedExtension/context', () => ({
	...jest.requireActual('../../../../react/nodes/multiBodiedExtension/context'),
	useMultiBodiedExtensionContext: jest.fn(),
}));

jest.mock('../../../../react/nodes/multiBodiedExtension/actions', () => ({
	...jest.requireActual('../../../../react/nodes/multiBodiedExtension/actions'),
	useMultiBodiedExtensionActions: jest.fn(),
}));

beforeEach(() => {
	(useMultiBodiedExtensionActions as jest.Mock).mockReturnValue({
		updateActiveChild: jest.fn(),
	});
	(useMultiBodiedExtensionContext as jest.Mock).mockReturnValue({
		loading: false,
		extensionContext: {
			NodeRenderer: ({ node }: any) => <div>Extension node with the key={node.extensionKey}</div>,
			privateProps: {
				__allowBodiedOverride: false,
			},
		},
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
const defaultProps: any = {
	serializer: jest.fn(),
	rendererContext: {},
	providers: {},
	extensionType: 'extension-type',
	extensionKey: 'extension-key',
	parameters: {},
	content: {},
	marks: [],
	localId: 'local-id',
};

eeTest.describe('platform_editor_renderer_extension_width_fix', 'width fix enabled').each(() => {
	eeTest
		.describe(
			'platform_editor_remove_important_in_render_ext',
			'remove important experiment enabled',
		)
		.variant(true, () => {
			it('should not set width when layout is default and rendererAppearance is full-page', () => {
				render(
					<MultiBodiedExtension
						{...defaultProps}
						layout="default"
						path={[]}
						rendererAppearance="full-page"
					>
						Test Content
					</MultiBodiedExtension>,
				);

				const wrapper = screen.getByTestId('multiBodiedExtension--wrapper-renderer') as HTMLElement;
				// default layout is not 'wide' or 'full-width', so isCustomLayout is false
				expect(wrapper.style.width).toBe('');
			});

			it('should set breakout width when layout is wide and rendererAppearance is full-page', () => {
				render(
					<MultiBodiedExtension
						{...defaultProps}
						layout="wide"
						path={[]}
						rendererAppearance="full-page"
					>
						Test Content
					</MultiBodiedExtension>,
				);

				const wrapper = screen.getByTestId('multiBodiedExtension--wrapper-renderer') as HTMLElement;
				// wide + full-page = custom layout, so breakout width should be set
				// Value depends on width_fix variant: calcBreakoutWidthCss (CSS vars) or calcBreakoutWidth (mocked to '960px')
				expect([calcBreakoutWidthCss('wide'), '960px']).toContain(wrapper.style.width);
				expect(wrapper.className).toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
			});

			it('should set breakout width when layout is full-width and rendererAppearance is full-page', () => {
				render(
					<MultiBodiedExtension
						{...defaultProps}
						layout="full-width"
						path={[]}
						rendererAppearance="full-page"
					>
						Test Content
					</MultiBodiedExtension>,
				);

				const wrapper = screen.getByTestId('multiBodiedExtension--wrapper-renderer') as HTMLElement;
				expect([calcBreakoutWidthCss('full-width'), '1800px']).toContain(wrapper.style.width);
				expect(wrapper.className).toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
			});

			it('should not set width when layout is wide but rendererAppearance is NOT full-page', () => {
				render(
					<MultiBodiedExtension
						{...defaultProps}
						layout="wide"
						path={[]}
						rendererAppearance="full-width"
					>
						Test Content
					</MultiBodiedExtension>,
				);

				const wrapper = screen.getByTestId('multiBodiedExtension--wrapper-renderer') as HTMLElement;
				// canUseCustomLayout is false (not full-page), so width should be undefined
				expect(wrapper.style.width).toBe('');
				expect(wrapper.className).not.toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
			});

			it('should not set width when layout is full-width but rendererAppearance is undefined', () => {
				render(
					<MultiBodiedExtension
						{...defaultProps}
						layout="full-width"
						path={[]}
						rendererAppearance={undefined}
					>
						Test Content
					</MultiBodiedExtension>,
				);

				const wrapper = screen.getByTestId('multiBodiedExtension--wrapper-renderer') as HTMLElement;
				expect(wrapper.style.width).toBe('');
				expect(wrapper.className).not.toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
			});
		});

	eeTest
		.describe(
			'platform_editor_remove_important_in_render_ext',
			'remove important experiment disabled (old behavior)',
		)
		.variant(false, () => {
			it('should set width to 100% when layout is default (old behavior)', () => {
				render(
					<MultiBodiedExtension
						{...defaultProps}
						layout="default"
						path={[]}
						rendererAppearance="full-page"
					>
						Test Content
					</MultiBodiedExtension>,
				);

				const wrapper = screen.getByTestId('multiBodiedExtension--wrapper-renderer') as HTMLElement;
				// Old behavior: isTopLevel and default layout, width should be '100%'
				expect(wrapper.style.width).toBe('100%');
				// default layout is not wide/full-width, so no center align
				expect(wrapper.className).not.toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
			});

			it('should set breakout width when layout is wide (old behavior always allows custom layout)', () => {
				render(
					<MultiBodiedExtension
						{...defaultProps}
						layout="wide"
						path={[]}
						rendererAppearance="full-width"
					>
						Test Content
					</MultiBodiedExtension>,
				);

				const wrapper = screen.getByTestId('multiBodiedExtension--wrapper-renderer') as HTMLElement;
				// Old behavior: canUseCustomLayout is always true, so wide+topLevel gives breakout width
				// Value depends on width_fix variant: calcBreakoutWidthCss (CSS vars) or calcBreakoutWidth (mocked to '960px')
				expect([calcBreakoutWidthCss('wide'), '960px']).toContain(wrapper.style.width);
				// Old behavior: canUseCustomLayout is always true, so center align is applied
				expect(wrapper.className).toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
			});
		});
});
