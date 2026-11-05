/* eslint-disable @atlaskit/editor/no-as-casting, react/jsx-props-no-spreading */

import React from 'react';

import { render, screen } from '@testing-library/react';

import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { RendererCssClassName } from '../../../../consts';
import MultiBodiedExtension from '../../../../react/nodes/multiBodiedExtension';
import { useMultiBodiedExtensionActions } from '../../../../react/nodes/multiBodiedExtension/actions';
import { useMultiBodiedExtensionContext } from '../../../../react/nodes/multiBodiedExtension/context';
import { calcBreakoutWidthCss } from '../../../../react/utils/breakout';

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

describe('multi-bodied extensions with breakout marks', () => {
	it('uses breakout sizing when extension resizing is enabled', () => {
		mockExpEnabled('platform_editor_lovability_resize_extensions');

		passGate('platform_editor_lovability_resize_exts_gracefully');
		mockExpEnabled('platform_editor_lovability_resize_exts_patch_1');

		const schema = getSchemaBasedOnStage('stage0');
		const marks = [schema.marks.breakout.create({ mode: 'wide', width: 900 })];

		render(
			<MultiBodiedExtension
				{...defaultProps}
				marks={marks}
				layout="wide"
				path={[]}
				rendererAppearance="full-page"
			>
				Test Content
			</MultiBodiedExtension>,
		);

		const wrapper = screen.getByTestId('multiBodiedExtension--wrapper-renderer');
		expect(wrapper.className).not.toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
		expect(wrapper.style.width).toBe('100%');
	});

	it('uses breakout sizing when extension resizing is disabled', () => {
		mockExpDisabled('platform_editor_lovability_resize_extensions');

		passGate('platform_editor_lovability_resize_exts_gracefully');
		mockExpEnabled('platform_editor_lovability_resize_exts_patch_1');

		const schema = getSchemaBasedOnStage('stage0');
		const marks = [schema.marks.breakout.create({ mode: 'wide', width: 900 })];

		render(
			<MultiBodiedExtension
				{...defaultProps}
				marks={marks}
				layout="wide"
				path={[]}
				rendererAppearance="full-page"
			>
				Test Content
			</MultiBodiedExtension>,
		);

		const wrapper = screen.getByTestId('multiBodiedExtension--wrapper-renderer');
		expect(wrapper.className).not.toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
		expect(wrapper.style.width).toBe('100%');
	});
});

describe('remove important experiment enabled', () => {
	beforeEach(() => {
		mockExpEnabled('platform_editor_remove_important_in_render_ext');
	});

	it('should not set width when layout is default and rendererAppearance is full-page', async () => {
		const { container } = render(
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
		await expect(container).toBeAccessible();
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

describe('remove important experiment disabled (old behavior)', () => {
	beforeEach(() => {
		mockExpDisabled('platform_editor_remove_important_in_render_ext');
	});

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
