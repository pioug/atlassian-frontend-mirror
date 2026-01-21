/* eslint-disable @atlaskit/editor/no-as-casting */
import React from 'react';
import { render } from '@testing-library/react';

import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
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
			.variant(true, () => {
				eeTest
					.describe(
						'platform_editor_render_bodied_extension_as_inline',
						'inline experiment enabled',
					)
					.variant(true, () => {
						it('with callback provided', () => {
							const { getByTestId } = render(
								<Extension {...baseProps} shouldDisplayExtensionAsInline={() => true} />,
							);

							const wrapper = getByTestId('extension--wrapper') as HTMLElement;
							expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('100%');
							expect(wrapper.style.minHeight).toBe('200px');
						});

						it('without callback', () => {
							const { getByTestId } = render(<Extension {...baseProps} />);

							const wrapper = getByTestId('extension--wrapper') as HTMLElement;
							expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('100%');
							expect(wrapper.style.minHeight).toBe('200px');
						});
					});

				eeTest
					.describe(
						'platform_editor_render_bodied_extension_as_inline',
						'inline experiment disabled',
					)
					.variant(false, () => {
						it('with callback returning true', () => {
							const { getByTestId } = render(
								<Extension {...baseProps} shouldDisplayExtensionAsInline={() => true} />,
							);

							const wrapper = getByTestId('extension--wrapper') as HTMLElement;
							expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('100%');
							expect(wrapper.style.minHeight).toBe('200px');
						});

						// eslint-disable-next-line jest/no-identical-title
						it('without callback', () => {
							const { getByTestId } = render(<Extension {...baseProps} />);

							const wrapper = getByTestId('extension--wrapper') as HTMLElement;
							expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('100%');
							expect(wrapper.style.minHeight).toBe('200px');
						});
					});
			});

		eeTest
			.describe('platform_editor_renderer_extension_width_fix', 'width fix disabled')
			.variant(false, () => {
				eeTest
					.describe(
						'platform_editor_render_bodied_extension_as_inline',
						'inline experiment enabled',
					)
					.variant(true, () => {
						// eslint-disable-next-line jest/no-identical-title
						it('with callback returning true', () => {
							const { container } = render(
								<Extension {...baseProps} shouldDisplayExtensionAsInline={() => true} />,
							);

							const wrapper = container.querySelector(`.${RendererCssClassName.EXTENSION}`) as HTMLElement;
							expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('100%');
							expect(wrapper.style.minHeight).toBe('200px');
						});

						// eslint-disable-next-line jest/no-identical-title
						it('without callback', () => {
							const { container } = render(<Extension {...baseProps} />);

							const wrapper = container.querySelector(`.${RendererCssClassName.EXTENSION}`) as HTMLElement;
							expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('100%');
							expect(wrapper.style.minHeight).toBe('200px');
						});
					});

				eeTest
					.describe(
						'platform_editor_render_bodied_extension_as_inline',
						'inline experiment disabled',
					)
					.variant(false, () => {
						// eslint-disable-next-line jest/no-identical-title
						it('with callback returning true', () => {
							const { container } = render(
								<Extension {...baseProps} shouldDisplayExtensionAsInline={() => true} />,
							);

							const wrapper = container.querySelector(`.${RendererCssClassName.EXTENSION}`) as HTMLElement;
							expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('100%');
							expect(wrapper.style.minHeight).toBe('200px');
						});

						// eslint-disable-next-line jest/no-identical-title
						it('without callback', () => {
							const { container } = render(<Extension {...baseProps} />);

							const wrapper = container.querySelector(`.${RendererCssClassName.EXTENSION}`) as HTMLElement;
							expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('100%');
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
			.variant(true, () => {
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
							expect(wrapper.style.width).toBe('100%');
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
							expect(wrapper.style.width).toBe('100%');
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
							expect(wrapper.style.width).toBe('100%');
							expect(wrapper.style.minHeight).toBe('112pxpx');
						});
					});
			});

		eeTest
			.describe('platform_editor_renderer_extension_width_fix', 'width fix disabled')
			.variant(false, () => {
				eeTest
					.describe(
						'platform_editor_render_bodied_extension_as_inline',
						'inline experiment enabled',
					)
					.variant(true, () => {
						// eslint-disable-next-line jest/no-identical-title
						it('with callback returning true - applies inline class and clears styles', () => {
							const { container } = render(
								<BodiedExtension {...baseProps} shouldDisplayExtensionAsInline={() => true}>
									<p>Inline extension content</p>
								</BodiedExtension>,
							);

							const wrapper = container.querySelector(`.${RendererCssClassName.EXTENSION}`) as HTMLElement;
							expect(wrapper).toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('');
							expect(wrapper.style.minHeight).toBe('');
						});

						// eslint-disable-next-line jest/no-identical-title
						it('without callback - does not apply inline class and sets styles', () => {
							const { container } = render(
								<BodiedExtension {...baseProps}>
									<p>Inline extension content</p>
								</BodiedExtension>,
							);

							const wrapper = container.querySelector(`.${RendererCssClassName.EXTENSION}`) as HTMLElement;
							expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('100%');
							expect(wrapper.style.minHeight).toBe('112pxpx');
						});
					});

				eeTest
					.describe(
						'platform_editor_render_bodied_extension_as_inline',
						'inline experiment disabled',
					)
					.variant(false, () => {
						// eslint-disable-next-line jest/no-identical-title
						it('with callback returning true - does not apply inline class and sets styles', () => {
							const { container } = render(
								<BodiedExtension {...baseProps} shouldDisplayExtensionAsInline={() => true}>
									<p>Inline extension content</p>
								</BodiedExtension>,
							);

							const wrapper = container.querySelector(`.${RendererCssClassName.EXTENSION}`) as HTMLElement;
							expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('100%');
							expect(wrapper.style.minHeight).toBe('112pxpx');
						});

						// eslint-disable-next-line jest/no-identical-title
						it('without callback - does not apply inline class and sets styles', () => {
							const { container } = render(
								<BodiedExtension {...baseProps}>
									<p>Inline extension content</p>
								</BodiedExtension>,
							);

							const wrapper = container.querySelector(`.${RendererCssClassName.EXTENSION}`) as HTMLElement;
							expect(wrapper).not.toHaveClass(RendererCssClassName.EXTENSION_AS_INLINE);
							expect(wrapper.style.width).toBe('100%');
							expect(wrapper.style.minHeight).toBe('112pxpx');
						});
					});
			});
	});
});
