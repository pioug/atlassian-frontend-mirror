import React from 'react';
import { mount } from 'enzyme';
import Extension from '../../../../react/nodes/extension';
import type { RendererContext } from '../../../../react/types';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/extensions';
import { IntlProvider } from 'react-intl-next';
import Loadable from 'react-loadable';
import { act } from 'react-dom/test-utils';

describe('Renderer - React/Nodes/Extension', () => {
	const providerFactory = ProviderFactory.create({});
	const extensionHandlers: ExtensionHandlers = {
		'com.atlassian.fabric': (param: any) => {
			switch (param.extensionKey) {
				case 'react':
					return <p>This is a react element</p>;
				case 'error':
					throw new Error('Tong is cursing you...');
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
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.stride',
						extensionKey: 'default',
					},
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'This is the default content of the extension',
								},
							],
						},
					],
				},
			],
		},
		schema: getSchemaBasedOnStage('stage0'),
	};

	it('should be able to fall back to default content', () => {
		const extension = mount(
			<Extension
				providers={providerFactory}
				extensionHandlers={extensionHandlers}
				rendererContext={rendererContext}
				extensionType="com.atlassian.fabric"
				extensionKey="default"
				text="This is the default text"
				localId="c145e554-f571-4208-a0f1-2170e1987722"
			/>,
		);

		expect(extension.find('div').first().text()).toEqual('This is the default text');
		extension.unmount();
	});

	it('should be able to render React.Element from extensionHandler', () => {
		const extension = mount(
			<Extension
				providers={providerFactory}
				extensionHandlers={extensionHandlers}
				rendererContext={rendererContext}
				extensionType="com.atlassian.fabric"
				extensionKey="react"
				localId="c145e554-f571-4208-a0f1-2170e1987722"
			/>,
		);

		expect(extension.find('div').first().text()).toEqual('This is a react element');
		extension.unmount();
	});

	it('should render the default content if extensionHandler throws an exception', () => {
		const extension = mount(
			<Extension
				providers={providerFactory}
				extensionHandlers={extensionHandlers}
				rendererContext={rendererContext}
				extensionType="com.atlassian.fabric"
				extensionKey="error"
				localId="c145e554-f571-4208-a0f1-2170e1987722"
			/>,
		);

		expect(extension.find('div').first().text()).toEqual('extension');
		extension.unmount();
	});

	it('extension handler should receive type = extension', () => {
		const extensionHandler = jest.fn();
		const extensionHandlers: ExtensionHandlers = {
			'com.atlassian.fabric': extensionHandler,
		};

		const fragmentLocalId = 'fragment-local-id';
		const fragmentMark = rendererContext.schema!.marks.fragment.create({
			localId: fragmentLocalId,
		});

		const extension = mount(
			<Extension
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
			type: 'extension',
			extensionType: 'com.atlassian.fabric',
			extensionKey: 'react',
			parameters: undefined,
			content: undefined,
			localId: 'c145e554-f571-4208-a0f1-2170e1987722',
			fragmentLocalId,
		});

		extension.unmount();
	});

	describe('extension providers', () => {
		const ExtensionHandlerFromProvider = ({ node }: any) => (
			<div>Extension provider: {node.content}</div>
		);

		const confluenceMacrosExtensionProvider = createFakeExtensionProvider(
			'fake.confluence',
			'macro',
			ExtensionHandlerFromProvider,
		);

		const providers = ProviderFactory.create({
			extensionProvider: Promise.resolve(
				combineExtensionProviders([confluenceMacrosExtensionProvider]),
			),
		});

		it('should be able to render extensions with the extension provider', async () => {
			const extension = mount(
				<IntlProvider locale="en">
					<Extension
						providers={providers}
						extensionHandlers={extensionHandlers}
						rendererContext={rendererContext}
						extensionType="fake.confluence"
						extensionKey="macro"
						text="Hello extension"
						localId="c145e554-f571-4208-a0f1-2170e1987722"
					/>
				</IntlProvider>,
			);

			await act(async () => {
				await Loadable.preloadAll();
			});

			extension.update();

			expect(extension.text()).toEqual('Extension provider: Hello extension');

			extension.unmount();
		});

		it('should prioritize extension handlers (sync) over extension provider', async () => {
			const extensionHandlers: ExtensionHandlers = {
				'fake.confluence': (node: any) => <div>Extension handler: {node.content}</div>,
			};

			const extension = mount(
				<IntlProvider locale="en">
					<Extension
						providers={providers}
						extensionHandlers={extensionHandlers}
						rendererContext={rendererContext}
						extensionType="fake.confluence"
						extensionKey="macro"
						text="Hello extension"
						localId="c145e554-f571-4208-a0f1-2170e1987722"
					/>
				</IntlProvider>,
			);

			expect(extension.text()).toEqual('Extension handler: Hello extension');

			extension.unmount();
		});

		it('should fallback to extension provider if not handled by extension handler', async () => {
			const extensionHandlers: ExtensionHandlers = {
				'fake.confluence': () => null,
			};

			const extension = mount(
				<IntlProvider locale="en">
					<Extension
						providers={providers}
						extensionHandlers={extensionHandlers}
						rendererContext={rendererContext}
						extensionType="fake.confluence"
						extensionKey="macro"
						text="Hello extension"
						localId="c145e554-f571-4208-a0f1-2170e1987722"
					/>
				</IntlProvider>,
			);

			await act(async () => {
				await Loadable.preloadAll();
			});

			extension.update();

			expect(extension.text()).toEqual('Extension provider: Hello extension');

			extension.unmount();
		});
	});
});
