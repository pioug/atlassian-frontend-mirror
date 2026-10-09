import React from 'react';

import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { IntlProvider } from 'react-intl';

import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Existing renderer extension provider test helper.
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/extensions';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import Renderer from '../../../../ui/Renderer';
import type { RendererProps } from '../../../../ui/renderer-props';

const extensionId = 'ari:cloud:ecosystem::extension/test-app/test-environment/static/test-macro';
const document: RendererProps['document'] = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'extension',
			attrs: {
				extensionType: 'com.atlassian.ecosystem',
				extensionKey: 'test-macro',
				parameters: { extensionId },
				localId: 'viewport-macro',
			},
		},
	],
};

const fullRenderer = (props: Partial<RendererProps> = {}) => (
	<IntlProvider locale="en">
		<Renderer
			document={document}
			extensionViewportSizes={[{ extensionId, viewportSize: 'medium' }]}
			extensionHandlers={{ 'com.atlassian.ecosystem': () => <p>Loaded macro</p> }}
			// Test fixture forwards the renderer options exercised by each case.
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		/>
	</IntlProvider>
);

describe('Forge viewport heights through the ADF renderer', () => {
	it.each([
		['small', '112px'],
		['medium', '262px'],
		['large', '524px'],
		['xlarge', '1048px'],
	])(
		'passes installed %s viewport metadata through serialization and SSR',
		(viewportSize, height) => {
			passGate('confluence_forge_early_render_reserve_height');
			const macro = fullRenderer({ extensionViewportSizes: [{ extensionId, viewportSize }] });
			expect(renderToString(macro)).toContain(`min-height:${height}`);
			render(macro);
			expect(screen.getByText('Loaded macro')).toBeVisible();
			expect(screen.getByTestId('extension--wrapper').style.minHeight).toBe(height);
		},
	);

	it('keeps loaded macro content accessible through the full renderer', async () => {
		passGate('confluence_forge_early_render_reserve_height');
		const { container } = render(fullRenderer());
		await expect(container).toBeAccessible();
	});

	it('passes numeric Connect node heights through the serializer callback', () => {
		const getExtensionHeight = jest.fn(() => '150');
		render(fullRenderer({ getExtensionHeight }));
		expect(getExtensionHeight).toHaveBeenCalled();
		expect(screen.getByTestId('extension--wrapper').style.minHeight).toBe('150px');
	});

	it('reserves height for default content when no extension handler is available', () => {
		passGate('confluence_forge_early_render_reserve_height');
		render(fullRenderer({ extensionHandlers: {} }));
		expect(screen.getByTestId('extension--wrapper').style.minHeight).toBe('262px');
	});

	it('keeps the same reservation while the extension provider resolves', async () => {
		passGate('confluence_forge_early_render_reserve_height');
		let resolveProvider: (value: ExtensionProvider) => void = () => {};
		const providers = ProviderFactory.create({
			extensionProvider: new Promise<ExtensionProvider>((resolve) => {
				resolveProvider = resolve;
			}),
		});
		try {
			render(fullRenderer({ extensionHandlers: {}, dataProviders: providers }));
			expect(screen.getByTestId('extension--wrapper').style.minHeight).toBe('262px');
			await act(async () => {
				resolveProvider(
					combineExtensionProviders([
						createFakeExtensionProvider('com.atlassian.ecosystem', 'test-macro', () => (
							<p>Provider macro</p>
						)),
					]),
				);
			});
			expect(await screen.findByText('Provider macro')).toBeVisible();
			expect(screen.getByTestId('extension--wrapper').style.minHeight).toBe('262px');
		} finally {
			providers.destroy();
		}
	});

	it('keeps the SSR wrapper and reservation through full renderer hydration', async () => {
		passGate('confluence_forge_early_render_reserve_height');
		const macro = fullRenderer();
		const container = window.document.createElement('div');
		container.innerHTML = renderToString(macro);
		window.document.body.appendChild(container);
		const wrapper = screen.getByTestId('extension--wrapper');
		expect(wrapper.style.minHeight).toBe('262px');
		const onRecoverableError = jest.fn();
		let root: ReturnType<typeof hydrateRoot> | undefined;
		try {
			await act(async () => {
				root = hydrateRoot(container, macro, { onRecoverableError });
			});
			expect(screen.getByTestId('extension--wrapper')).toBe(wrapper);
			expect(wrapper.style.minHeight).toBe('262px');
			expect(onRecoverableError).not.toHaveBeenCalled();
		} finally {
			act(() => root?.unmount());
			// Hydration starts from real server markup outside Testing Library's root.
			container.remove();
		}
	});

	[true, false].forEach((isEnabled) => {
		eeTest
			.describe('platform_editor_render_bodied_extension_as_inline', 'viewport compatibility')
			.variant(isEnabled, () => {
				it('only excludes block reservation when inline rendering is enabled', () => {
					passGate('confluence_forge_early_render_reserve_height');
					render(
						fullRenderer({
							document: {
								...document,
								content: [
									{
										type: 'bodiedExtension',
										attrs: {
											extensionType: 'com.atlassian.ecosystem',
											extensionKey: 'test-macro',
											parameters: { extensionId },
											localId: 'viewport-macro',
										},
										content: [
											{ type: 'paragraph', content: [{ type: 'text', text: 'Macro body' }] },
										],
									},
								],
							},
							shouldDisplayExtensionAsInline: () => true,
						}),
					);
					expect(screen.getByTestId('extension--wrapper').style.minHeight).toBe(
						isEnabled ? '' : '262px',
					);
				});
			});
	});
});

describe('Full renderer with viewport correction disabled', () => {
	it('retains the invalid legacy SSR height when the correction is disabled', () => {
		failGate('confluence_forge_early_render_reserve_height');
		expect(renderToString(fullRenderer())).toContain('min-height:262pxpx');
	});
});
