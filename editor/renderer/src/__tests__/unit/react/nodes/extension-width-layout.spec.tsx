/* eslint-disable @atlaskit/editor/no-as-casting, react/jsx-props-no-spreading */

import React from 'react';

import { render, screen } from '@testing-library/react';

import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import { RendererCssClassName } from '../../../../consts';
import ReactSerializer from '../../../../react';
import BodiedExtension from '../../../../react/nodes/bodiedExtension';
import Extension from '../../../../react/nodes/extension';
import type { RendererContext } from '../../../../react/types';
import { calcBreakoutWidthCss } from '../../../../react/utils/breakout';
import { RendererStyleContainer } from '../../../../ui/Renderer/RendererStyleContainer';

const providerFactory = ProviderFactory.create({});
const extensionHandlers: ExtensionHandlers = {
	'com.atlassian.fabric': (param: any) => {
		switch (param.extensionKey) {
			case 'react':
				return <p>This is a react element</p>;
			default:
				return null;
		}
	},
};

const rendererContext: RendererContext = {
	adDoc: {
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						text: 'Check out this extension',
					},
				],
			},
		],
	},
	schema: getSchemaBasedOnStage('stage0'),
};

const serializer = new ReactSerializer({});

describe('Extension - canUseCustomLayout behavior with rendererAppearance', () => {
	const baseProps = {
		providers: providerFactory,
		extensionHandlers,
		rendererContext,
		extensionType: 'com.atlassian.fabric',
		extensionKey: 'default',
		text: 'Extension content',
		localId: 'c145e554-f571-4208-a0f1-2170e1987722',
		isTopLevel: true,
	};

	eeTest.describe('platform_editor_renderer_extension_width_fix', 'width fix enabled').each(() => {
		eeTest
			.describe('platform_editor_remove_important_in_render_ext', 'remove important experiment')
			.variant(true, () => {
				it('should not set width when layout is default and rendererAppearance is full-page', () => {
					render(<Extension {...baseProps} layout="default" rendererAppearance="full-page" />);

					const wrapper = screen.getByTestId('extension--wrapper') as HTMLElement;
					// default layout is not custom, so width should be undefined
					expect(wrapper.style.width).toBe('');
				});

				it('should set breakout width when layout is wide and rendererAppearance is full-page', () => {
					render(<Extension {...baseProps} layout="wide" rendererAppearance="full-page" />);

					const wrapper = screen.getByTestId('extension--wrapper') as HTMLElement;
					// wide layout + full-page = custom layout, so breakout width should be applied
					expect(wrapper.style.width).toBe(calcBreakoutWidthCss('wide'));
					expect(wrapper.className).toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
				});

				it('should set breakout width when layout is full-width and rendererAppearance is full-page', () => {
					render(<Extension {...baseProps} layout="full-width" rendererAppearance="full-page" />);

					const wrapper = screen.getByTestId('extension--wrapper') as HTMLElement;
					// full-width layout + full-page = custom layout, so breakout width should be applied
					expect(wrapper.style.width).toBe(calcBreakoutWidthCss('full-width'));
					expect(wrapper.className).toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
				});

				it('should not set width when layout is wide but rendererAppearance is NOT full-page', () => {
					render(<Extension {...baseProps} layout="wide" rendererAppearance="full-width" />);

					const wrapper = screen.getByTestId('extension--wrapper') as HTMLElement;
					// wide layout but not full-page appearance = canUseCustomLayout is false, so width should be undefined
					expect(wrapper.style.width).toBe('');
					expect(wrapper.className).not.toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
				});

				it('should not set width when layout is full-width but rendererAppearance is undefined', () => {
					render(<Extension {...baseProps} layout="full-width" rendererAppearance={undefined} />);

					const wrapper = screen.getByTestId('extension--wrapper') as HTMLElement;
					// full-width layout but undefined appearance = canUseCustomLayout is false, so width should be undefined
					expect(wrapper.style.width).toBe('');
					expect(wrapper.className).not.toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
				});
			});

		eeTest
			.describe(
				'platform_editor_remove_important_in_render_ext',
				'remove important experiment off (old behavior)',
			)
			.variant(false, () => {
				it('should set width to 100% when layout is default (old behavior)', () => {
					render(<Extension {...baseProps} layout="default" rendererAppearance="full-page" />);

					const wrapper = screen.getByTestId('extension--wrapper') as HTMLElement;
					// Old behavior: isTopLevel is true and layout is default, but isCustomLayout is false
					// so width falls through to '100%'
					expect(wrapper.style.width).toBe('100%');
					// default layout is not wide/full-width, so no center align
					expect(wrapper.className).not.toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
				});

				it('should set breakout width when layout is wide (old behavior always allows custom layout)', () => {
					render(<Extension {...baseProps} layout="wide" rendererAppearance="full-width" />);

					const wrapper = screen.getByTestId('extension--wrapper') as HTMLElement;
					// Old behavior: canUseCustomLayout is always true, so wide+topLevel = custom layout with breakout width
					expect(wrapper.style.width).toBe(calcBreakoutWidthCss('wide'));
					// Old behavior: canUseCustomLayout is always true, so center align is applied
					expect(wrapper.className).toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
				});
			});

		describe('table fit-to-content containment patches', () => {
			const tablePath = [rendererContext.schema!.nodes.table.create()];

			it('does not apply inline-size containment inside a table when patch 2 is disabled', () => {
				mockExpDisabled('platform_editor_table_fit_to_content_patch_2');
				render(<Extension {...baseProps} path={tablePath} />);

				const innerWrapper = screen.getByText('Extension content');

				expect(getComputedStyle(innerWrapper).containerType).toBe('');
			});

			it('does not affect containment inside a regular table when patch 2 is enabled', () => {
				mockExpEnabled('platform_editor_table_fit_to_content_patch_2');
				render(<Extension {...baseProps} path={tablePath} />);

				const innerWrapper = screen.getByText('Extension content');

				expect(getComputedStyle(innerWrapper).containerType).toBe('inline-size');
			});

			it('removes inline-size containment only inside a content-mode table with patch 2', () => {
				mockExpEnabled('platform_editor_table_fit_to_content_patch_2');
				render(
					<RendererStyleContainer
						appearance="full-page"
						allowNestedHeaderLinks={false}
						useBlockRenderForCodeBlock={false}
					>
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- The fixture must match the renderer's scoped table selector.
							className={RendererCssClassName.DOCUMENT}
						>
							<table data-initial-width-mode="content">
								<tbody>
									<tr>
										<td>
											<Extension {...baseProps} path={tablePath} />
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</RendererStyleContainer>,
				);

				const innerWrapper = screen.getByText('Extension content');

				expect(getComputedStyle(innerWrapper).containerType).toBe('normal');
			});

			it('does not affect containment outside tables when patch 2 is enabled', () => {
				mockExpEnabled('platform_editor_table_fit_to_content_patch_2');
				render(<Extension {...baseProps} />);

				const innerWrapper = screen.getByText('Extension content');

				expect(getComputedStyle(innerWrapper).containerType).toBe('inline-size');
			});
		});
	});
});

describe('BodiedExtension - passes rendererAppearance to renderExtension', () => {
	const baseProps = {
		providers: providerFactory,
		serializer,
		extensionHandlers,
		rendererContext,
		extensionType: 'com.atlassian.fabric',
		extensionKey: 'default',
		localId: 'c145e554-f571-4208-a0f1-2170e1987722',
		startPos: 1,
		layout: 'default' as const,
		parameters: { extensionId: 'test-extension-id' },
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
						<BodiedExtension {...baseProps} rendererAppearance="full-page">
							<p>Extension content</p>
						</BodiedExtension>,
					);

					const wrapper = screen.getByTestId('extension--wrapper') as HTMLElement;
					// default layout is not custom, so width should be undefined
					expect(wrapper.style.width).toBe('');
				});

				it('should set breakout width when layout is wide and rendererAppearance is full-page', () => {
					render(
						<BodiedExtension {...baseProps} layout="wide" rendererAppearance="full-page">
							<p>Extension content</p>
						</BodiedExtension>,
					);

					const wrapper = screen.getByTestId('extension--wrapper') as HTMLElement;
					// wide layout + full-page = custom layout, so breakout width should be applied
					expect(wrapper.style.width).toBe(calcBreakoutWidthCss('wide'));
					expect(wrapper.className).toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
				});

				it('should set breakout width when layout is full-width and rendererAppearance is full-page', () => {
					render(
						<BodiedExtension {...baseProps} layout="full-width" rendererAppearance="full-page">
							<p>Extension content</p>
						</BodiedExtension>,
					);

					const wrapper = screen.getByTestId('extension--wrapper') as HTMLElement;
					// full-width layout + full-page = custom layout, so breakout width should be applied
					expect(wrapper.style.width).toBe(calcBreakoutWidthCss('full-width'));
					expect(wrapper.className).toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
				});

				it('should not set width when layout is wide but rendererAppearance is NOT full-page', () => {
					render(
						<BodiedExtension {...baseProps} layout="wide" rendererAppearance="full-width">
							<p>Extension content</p>
						</BodiedExtension>,
					);

					const wrapper = screen.getByTestId('extension--wrapper') as HTMLElement;
					// wide layout but not full-page appearance = canUseCustomLayout is false
					expect(wrapper.style.width).toBe('');
					expect(wrapper.className).not.toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
				});

				it('should not set width when layout is full-width but rendererAppearance is undefined', () => {
					render(
						<BodiedExtension {...baseProps} layout="full-width" rendererAppearance={undefined}>
							<p>Extension content</p>
						</BodiedExtension>,
					);

					const wrapper = screen.getByTestId('extension--wrapper') as HTMLElement;
					// full-width layout but undefined appearance = canUseCustomLayout is false
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
						<BodiedExtension {...baseProps} rendererAppearance="full-page">
							<p>Extension content</p>
						</BodiedExtension>,
					);

					const wrapper = screen.getByTestId('extension--wrapper') as HTMLElement;
					// Old behavior: isTopLevel is true and layout is default, but isCustomLayout is false
					// so width falls through to '100%'
					expect(wrapper.style.width).toBe('100%');
					// default layout is not wide/full-width, so no center align
					expect(wrapper.className).not.toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
				});

				it('should set breakout width when layout is wide (old behavior always allows custom layout)', () => {
					render(
						<BodiedExtension {...baseProps} layout="wide" rendererAppearance="full-width">
							<p>Extension content</p>
						</BodiedExtension>,
					);

					const wrapper = screen.getByTestId('extension--wrapper') as HTMLElement;
					// Old behavior: canUseCustomLayout is always true, so wide+topLevel = custom layout with breakout width
					expect(wrapper.style.width).toBe(calcBreakoutWidthCss('wide'));
					// Old behavior: canUseCustomLayout is always true, so center align is applied
					expect(wrapper.className).toContain(RendererCssClassName.EXTENSION_CENTER_ALIGN);
				});
			});
	});
});
