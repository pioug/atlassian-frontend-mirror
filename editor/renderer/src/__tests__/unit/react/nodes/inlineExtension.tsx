import React from 'react';
import { act, render } from '@testing-library/react';
import InlineExtension from '../../../../react/nodes/inlineExtension';
import type { RendererContext } from '../../../../react/types';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/extensions';
import { IntlProvider } from 'react-intl';
import Loadable from 'react-loadable';

describe('Renderer - React/Nodes/InlineExtension', () => {
	const providerFactory = ProviderFactory.create({});
	const extensionHandlers: ExtensionHandlers = {
		'com.atlassian.fabric': (param: any) => {
			switch (param.extensionKey) {
				case 'react':
					return <span>This is a react element</span>;
				case 'error':
					throw new Error('Cursed by Tong');
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
				{
					type: 'inlineExtension',
					attrs: {
						extensionType: 'com.atlassian.stride',
						extensionKey: 'default',
						bodyType: 'none',
					},
					content: [
						{
							type: 'text',
							text: 'This is the default content of the extension',
						},
					],
				},
			],
		},
		schema: getSchemaBasedOnStage('stage0'),
	};

	it('should be able to fall back to default content', () => {
		const { container } = render(
			<InlineExtension
				providers={providerFactory}
				extensionHandlers={extensionHandlers}
				rendererContext={rendererContext}
				extensionType="com.atlassian.fabric"
				extensionKey="default"
				text="This is the default text"
				localId="c145e554-f571-4208-a0f1-2170e1987722"
			/>,
		);

		expect(container.querySelector('span')?.textContent).toEqual('This is the default text');
	});

	it('should be able to render React.Element from extensionHandler', () => {
		const { container } = render(
			<InlineExtension
				providers={providerFactory}
				extensionHandlers={extensionHandlers}
				rendererContext={rendererContext}
				extensionType="com.atlassian.fabric"
				extensionKey="react"
				localId="c145e554-f571-4208-a0f1-2170e1987722"
			/>,
		);

		expect(container.querySelector('span')?.textContent).toEqual('This is a react element');
	});

	it('should render the default content if extensionHandler throws an exception', () => {
		const { container } = render(
			<InlineExtension
				providers={providerFactory}
				extensionHandlers={extensionHandlers}
				rendererContext={rendererContext}
				extensionType="com.atlassian.fabric"
				extensionKey="error"
				localId="c145e554-f571-4208-a0f1-2170e1987722"
			/>,
		);

		expect(container.querySelector('span')?.textContent).toEqual('inlineExtension');
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<InlineExtension
				providers={providerFactory}
				extensionHandlers={extensionHandlers}
				rendererContext={rendererContext}
				extensionType="com.atlassian.fabric"
				extensionKey="react"
				localId="c145e554-f571-4208-a0f1-2170e1987722"
			/>,
		);

		await expect(container).toBeAccessible();
	});

	it('extension handler should receive type = inlineExtension', () => {
		const extensionHandler = jest.fn();
		const extensionHandlers: ExtensionHandlers = {
			'com.atlassian.fabric': extensionHandler,
		};

		const fragmentLocalId = 'fragment-local-id';
		const fragmentMark = rendererContext.schema!.marks.fragment.create({
			localId: fragmentLocalId,
		});

		render(
			<InlineExtension
				providers={providerFactory}
				extensionHandlers={extensionHandlers}
				rendererContext={rendererContext}
				extensionType="com.atlassian.fabric"
				extensionKey="react"
				localId="c145e554-f571-4208-a0f1-2170e1987722"
				marks={[fragmentMark]}
			/>,
		);

		expect(extensionHandler.mock.calls[0][0]).toEqual({
			type: 'inlineExtension',
			extensionType: 'com.atlassian.fabric',
			extensionKey: 'react',
			parameters: undefined,
			content: undefined,
			localId: 'c145e554-f571-4208-a0f1-2170e1987722',
			fragmentLocalId,
		});
	});

	describe('extension providers', () => {
		const ExtensionHandlerFromProvider = ({ node }: any) => (
			<div>Extension provider: {node.parameters.words}</div>
		);

		const confluenceMacrosExtensionProvider = createFakeExtensionProvider(
			'fake.confluence',
			'inline-macro',
			ExtensionHandlerFromProvider,
		);

		const providers = ProviderFactory.create({
			extensionProvider: Promise.resolve(
				combineExtensionProviders([confluenceMacrosExtensionProvider]),
			),
		});

		it('should be able to render extensions with the extension provider', async () => {
			const { container } = render(
				<IntlProvider locale="en">
					<InlineExtension
						providers={providers}
						extensionHandlers={extensionHandlers}
						rendererContext={rendererContext}
						extensionType="fake.confluence"
						extensionKey="inline-macro"
						parameters={{
							words: 'lorem ipsum',
						}}
						localId="c145e554-f571-4208-a0f1-2170e1987722"
					/>
				</IntlProvider>,
			);

			await act(async () => {
				await Loadable.preloadAll();
			});

			expect(container.textContent).toEqual('Extension provider: lorem ipsum');
		});

		it('should prioritize extension handlers (sync) over extension provider', async () => {
			const extensionHandlers: ExtensionHandlers = {
				'fake.confluence': (node: any) => <div>Extension handler: {node.parameters.words}</div>,
			};

			const { container } = render(
				<IntlProvider locale="en">
					<InlineExtension
						providers={providers}
						extensionHandlers={extensionHandlers}
						rendererContext={rendererContext}
						extensionType="fake.confluence"
						extensionKey="inline-macro"
						parameters={{
							words: 'lorem ipsum',
						}}
						localId="c145e554-f571-4208-a0f1-2170e1987722"
					/>
				</IntlProvider>,
			);

			expect(container.textContent).toEqual('Extension handler: lorem ipsum');
		});

		it('should fallback to extension provider if not handled by extension handlers', async () => {
			const extensionHandlers: ExtensionHandlers = {
				'fake.confluence': () => null,
			};

			const { container } = render(
				<IntlProvider locale="en">
					<InlineExtension
						providers={providers}
						extensionHandlers={extensionHandlers}
						rendererContext={rendererContext}
						extensionType="fake.confluence"
						extensionKey="inline-macro"
						parameters={{
							words: 'lorem ipsum',
						}}
						localId="c145e554-f571-4208-a0f1-2170e1987722"
					/>
				</IntlProvider>,
			);

			await act(async () => {
				await Loadable.preloadAll();
			});

			expect(container.textContent).toEqual('Extension provider: lorem ipsum');
		});
	});
});
