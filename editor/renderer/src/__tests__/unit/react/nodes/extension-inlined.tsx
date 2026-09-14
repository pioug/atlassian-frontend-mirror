/* eslint-disable @atlaskit/editor/no-as-casting */
import React from 'react';
import { render } from '@testing-library/react';

import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import Extension from '../../../../react/nodes/extension';
import BodiedExtension from '../../../../react/nodes/bodiedExtension';
import type { RendererContext } from '../../../../react/types';
import ReactSerializer from '../../../../react';
import { RendererCssClassName } from '../../../../consts';

describe('Renderer - React/Nodes/Extension Inlined', () => {
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

	describe('Extension - inline styling and width/minHeight behavior', () => {
		// Note: Extension does not support inline rendering - shouldDisplayExtensionAsInline is always
		// passed as undefined to renderExtension, so inline functionality is disabled for Extension.
		const baseProps = {
			providers: providerFactory,
			extensionHandlers,
			rendererContext,
			extensionType: 'com.atlassian.fabric',
			extensionKey: 'default',
			text: 'Inline extension content',
			localId: 'c145e554-f571-4208-a0f1-2170e1987722',
			layout: 'default' as const,
			nodeHeight: '200',
			isTopLevel: true,
		};

		eeTest
			.describe('platform_editor_renderer_extension_width_fix', 'width fix enabled')
			.each(() => {
				eeTest
					.describe(
						'platform_editor_render_bodied_extension_as_inline',
						'inline experiment disabled',
					)
					.each(() => {
						it('should never apply inline class (Extension does not support inline rendering)', () => {
							const { getByTestId } = render(
								<Extension {...baseProps} shouldDisplayExtensionAsInline={() => true} />,
							);

							const wrapper = getByTestId('extension--wrapper') as HTMLElement;
							expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('');
							expect(wrapper.style.minHeight).toBe('200px');
						});
					});
			});
	});

	describe('BodiedExtension - inline styling and width/minHeight behavior', () => {
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
			// BodiedExtension uses extensionViewportSizes (not nodeHeight) to determine minHeight
			parameters: { extensionId: 'test-extension-id' },
			extensionViewportSizes: [{ extensionId: 'test-extension-id', viewportSize: 'small' }],
		};

		eeTest
			.describe('platform_editor_renderer_extension_width_fix', 'width fix enabled')
			.each(() => {
				eeTest
					.describe(
						'platform_editor_render_bodied_extension_as_inline',
						'inline experiment enabled',
					)
					.variant(true, () => {
						it('with callback returning true - applies inline class and clears styles', () => {
							const { getByTestId } = render(
								<BodiedExtension {...baseProps} shouldDisplayExtensionAsInline={() => true}>
									<p>Inline extension content</p>
								</BodiedExtension>,
							);

							const wrapper = getByTestId('extension--wrapper');
							expect(wrapper).toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('');
							expect(wrapper.style.minHeight).toBe('');
						});

						it('without callback - does not apply inline class and sets styles', () => {
							const { getByTestId } = render(
								<BodiedExtension {...baseProps}>
									<p>Inline extension content</p>
								</BodiedExtension>,
							);

							const wrapper = getByTestId('extension--wrapper') as HTMLElement;
							expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('');
							expect(wrapper.style.minHeight).toBe('112pxpx');
						});
					});

				eeTest
					.describe(
						'platform_editor_render_bodied_extension_as_inline',
						'inline experiment disabled',
					)
					.variant(false, () => {
						it('with callback returning true - does not apply inline class and sets styles', () => {
							const { getByTestId } = render(
								<BodiedExtension {...baseProps} shouldDisplayExtensionAsInline={() => true}>
									<p>Inline extension content</p>
								</BodiedExtension>,
							);

							const wrapper = getByTestId('extension--wrapper') as HTMLElement;
							expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('');
							expect(wrapper.style.minHeight).toBe('112pxpx');
						});

						// eslint-disable-next-line jest/no-identical-title
						it('without callback - does not apply inline class and sets styles', () => {
							const { getByTestId } = render(
								<BodiedExtension {...baseProps}>
									<p>Inline extension content</p>
								</BodiedExtension>,
							);

							const wrapper = getByTestId('extension--wrapper') as HTMLElement;
							expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('');
							expect(wrapper.style.minHeight).toBe('112pxpx');
						});
					});
			});
	});

	describe('BodiedExtension - native Forge inline-bodied macros', () => {
		const FORGE_EXTENSION_TYPE = 'com.atlassian.ecosystem';

		const baseProps = {
			providers: providerFactory,
			serializer,
			extensionHandlers,
			rendererContext,
			extensionType: FORGE_EXTENSION_TYPE,
			extensionKey: 'cc-eco-forge-bodied-outputtype',
			localId: 'c145e554-f571-4208-a0f1-2170e1987722',
			startPos: 1,
			layout: 'default' as const,
			parameters: {
				guestParams: { atlassianMacroOutputType: 'INLINE', atlassianForgeInlineBodied: 'true' },
			},
			getContent: () => [{ type: 'paragraph', content: [{ type: 'text', text: 'all resources' }] }],
		};

		// `isTopLevel` is derived from `path.length < 1`, so a non-empty path stands in for a
		// macro nested inside a container such as a layout column.
		const nestedPath = [{ type: { name: 'layoutColumn' } } as unknown as PMNode];

		eeTest
			.describe('platform_editor_renderer_extension_width_fix', 'width fix enabled')
			.each(() => {
				eeTest
					.describe(
						'platform_editor_render_bodied_extension_as_inline',
						'inline experiment enabled',
					)
					.variant(true, () => {
						describe('platform_forge_inline_bodied_macro enabled', () => {
							it('marks a top-level native Forge bodied macro with data-forge-inline', () => {
								passGate('platform_forge_inline_bodied_macro');
								const { getByTestId } = render(
									<BodiedExtension {...baseProps} shouldDisplayExtensionAsInline={() => true}>
										<p>Inline extension content</p>
									</BodiedExtension>,
								);

								const wrapper = getByTestId('extension--wrapper');
								expect(wrapper).toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
								expect(wrapper).toHaveAttribute('data-forge-inline', 'true');
								expect(wrapper).not.toHaveAttribute('data-migrated-inline');
							});

							it('marks a non-Forge inline-bodied extension as migrated, not native', () => {
								passGate('platform_forge_inline_bodied_macro');
								const { getByTestId } = render(
									<BodiedExtension
										{...baseProps}
										extensionType="com.atlassian.confluence.macro.core"
										parameters={{ guestParams: { atlassianMacroOutputType: 'INLINE' } }}
										shouldDisplayExtensionAsInline={() => true}
									>
										<p>Inline extension content</p>
									</BodiedExtension>,
								);

								const wrapper = getByTestId('extension--wrapper');
								expect(wrapper).toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
								expect(wrapper).not.toHaveAttribute('data-forge-inline');
								expect(wrapper).toHaveAttribute('data-migrated-inline', 'true');
							});

							// The population this scoping exists to protect: migrated Connect content
							// carries the output-type marker but never the Forge marker. It receives only
							// the migrated line-flow fix, not the native nested-renderer styling.
							it('marks a macro carrying only the output-type marker as migrated', () => {
								passGate('platform_forge_inline_bodied_macro');
								const { getByTestId } = render(
									<BodiedExtension
										{...baseProps}
										parameters={{ guestParams: { atlassianMacroOutputType: 'INLINE' } }}
										shouldDisplayExtensionAsInline={() => true}
									>
										<p>Inline extension content</p>
									</BodiedExtension>,
								);

								const wrapper = getByTestId('extension--wrapper');
								expect(wrapper).toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
								expect(wrapper).not.toHaveAttribute('data-forge-inline');
								expect(wrapper).toHaveAttribute('data-migrated-inline', 'true');
							});

							// Same as above — a bodyless extension short-circuits before the gate.
							it('does not mark a bodyless Forge extension', () => {
								const { getContent, ...propsWithoutContent } = baseProps;
								const { getByTestId } = render(
									<BodiedExtension
										{...propsWithoutContent}
										shouldDisplayExtensionAsInline={() => true}
									>
										<p>Inline extension content</p>
									</BodiedExtension>,
								);

								const wrapper = getByTestId('extension--wrapper');
								expect(wrapper).not.toHaveAttribute('data-forge-inline');
							});

							it('leaves a nested Forge bodied macro as a block, because sibling marking is top-level only', () => {
								passGate('platform_forge_inline_bodied_macro');
								const { getByTestId } = render(
									<BodiedExtension
										{...baseProps}
										path={nestedPath}
										shouldDisplayExtensionAsInline={() => true}
									>
										<p>Inline extension content</p>
									</BodiedExtension>,
								);

								const wrapper = getByTestId('extension--wrapper');
								expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
								expect(wrapper).not.toHaveAttribute('data-forge-inline');
							});
						});

						describe('platform_forge_inline_bodied_macro disabled', () => {
							beforeEach(() => {
								failGate('platform_forge_inline_bodied_macro');
							});

							it('does not mark a top-level native Forge bodied macro, gate off', () => {
								const { getByTestId } = render(
									<BodiedExtension {...baseProps} shouldDisplayExtensionAsInline={() => true}>
										<p>Inline extension content</p>
									</BodiedExtension>,
								);

								const wrapper = getByTestId('extension--wrapper');
								// The pre-existing inline treatment is unchanged by the gate.
								expect(wrapper).toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
								expect(wrapper).not.toHaveAttribute('data-forge-inline');
							});

							it('still inlines a nested Forge bodied macro, i.e. the guard is gated', () => {
								const { getByTestId } = render(
									<BodiedExtension
										{...baseProps}
										path={nestedPath}
										shouldDisplayExtensionAsInline={() => true}
									>
										<p>Inline extension content</p>
									</BodiedExtension>,
								);

								const wrapper = getByTestId('extension--wrapper');
								expect(wrapper).toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							});

							it('does not mark migrated inline-bodied macros when the gate is off', () => {
								const { getByTestId } = render(
									<BodiedExtension
										{...baseProps}
										parameters={{ guestParams: { atlassianMacroOutputType: 'INLINE' } }}
										shouldDisplayExtensionAsInline={() => true}
									>
										<p>Inline extension content</p>
									</BodiedExtension>,
								);

								expect(getByTestId('extension--wrapper')).not.toHaveAttribute(
									'data-migrated-inline',
								);
							});
						});
					});
			});
	});
});
