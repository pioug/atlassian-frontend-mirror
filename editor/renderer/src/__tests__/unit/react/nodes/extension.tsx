import React from 'react';
import Extension from '../../../../react/nodes/extension';
import type { RendererContext } from '../../../../react/types';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/extensions';
import { act, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import Loadable from 'react-loadable';

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
		const { container } = render(
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

		expect(container.querySelector('div')?.textContent).toEqual('This is the default text');
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<Extension
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

	it('should be able to render React.Element from extensionHandler', () => {
		const { container } = render(
			<Extension
				providers={providerFactory}
				extensionHandlers={extensionHandlers}
				rendererContext={rendererContext}
				extensionType="com.atlassian.fabric"
				extensionKey="react"
				localId="c145e554-f571-4208-a0f1-2170e1987722"
			/>,
		);

		expect(container.querySelector('div')?.textContent).toEqual('This is a react element');
	});

	it('should render the default content if extensionHandler throws an exception', () => {
		const { container } = render(
			<Extension
				providers={providerFactory}
				extensionHandlers={extensionHandlers}
				rendererContext={rendererContext}
				extensionType="com.atlassian.fabric"
				extensionKey="error"
				localId="c145e554-f571-4208-a0f1-2170e1987722"
			/>,
		);

		expect(container.querySelector('div')?.textContent).toEqual('extension');
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

		render(
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
			const { container } = render(
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

			expect(container.textContent).toEqual('Extension provider: Hello extension');
		});

		it('should prioritize extension handlers (sync) over extension provider', async () => {
			const extensionHandlers: ExtensionHandlers = {
				'fake.confluence': (node: any) => <div>Extension handler: {node.content}</div>,
			};

			const { container } = render(
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

			expect(container.textContent).toEqual('Extension handler: Hello extension');
		});

		it('should fallback to extension provider if not handled by extension handler', async () => {
			const extensionHandlers: ExtensionHandlers = {
				'fake.confluence': () => null,
			};

			const { container } = render(
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

			expect(container.textContent).toEqual('Extension provider: Hello extension');
		});

		const renderExtensionWithProvider = (
			providers: ProviderFactory,
			extensionKey: 'extension-a' | 'extension-b' = 'extension-a',
			hideExtensionKeysWhilePending?: string[],
		) =>
			render(
				<IntlProvider locale="en">
					<Extension
						providers={providers}
						extensionHandlers={extensionHandlers}
						rendererContext={rendererContext}
						extensionType="fake.extension"
						extensionKey={extensionKey}
						text="extension"
						hideExtensionKeysWhilePending={hideExtensionKeysWhilePending}
						localId="c145e554-f571-4208-a0f1-2170e1987722"
					/>
				</IntlProvider>,
			);

		describe('with hideExtensionKeysWhilePending including the extension key', () => {
			it('should not render the generic fallback while the provider is pending', () => {
				const providers = ProviderFactory.create({
					extensionProvider: new Promise<never>(() => {}),
				});

				const { container } = renderExtensionWithProvider(providers, 'extension-a', [
					'extension-a',
				]);

				expect(container.textContent).toEqual('');
			});

			it('should render the provider content after it resolves', async () => {
				let resolveProvider: (provider: ReturnType<typeof combineExtensionProviders>) => void;
				const providers = ProviderFactory.create({
					extensionProvider: new Promise((resolve) => {
						resolveProvider = resolve;
					}),
				});
				const extensionProvider = createFakeExtensionProvider(
					'fake.extension',
					'extension-a',
					({ node }: any) => <div>Extension provider</div>,
				);
				const { container } = renderExtensionWithProvider(providers, 'extension-a', [
					'extension-a',
				]);

				expect(container.textContent).toEqual('');

				await act(async () => {
					resolveProvider(combineExtensionProviders([extensionProvider]));
					await Loadable.preloadAll();
				});

				expect(container.textContent).toEqual('Extension provider');
			});

			it('should render the generic fallback after the provider rejects', async () => {
				let rejectProvider: (reason?: unknown) => void;
				const providers = ProviderFactory.create({
					extensionProvider: new Promise<never>((_resolve, reject) => {
						rejectProvider = reject;
					}),
				});
				const { container } = renderExtensionWithProvider(providers, 'extension-a', [
					'extension-a',
				]);

				expect(container.textContent).toEqual('');

				await act(async () => {
					rejectProvider(new Error('extension provider failed'));
					await Promise.resolve();
				});

				expect(container.textContent).toEqual('extension');
			});

			it('should render the generic fallback for extension keys not in the list while pending', () => {
				const providers = ProviderFactory.create({
					extensionProvider: new Promise<never>(() => {}),
				});

				const { container } = renderExtensionWithProvider(providers, 'extension-b', [
					'extension-a',
				]);

				expect(container.textContent).toEqual('extension');
			});
		});

		describe('without hideExtensionKeysWhilePending', () => {
			it('should render the generic fallback while the provider is pending', () => {
				const providers = ProviderFactory.create({
					extensionProvider: new Promise<never>(() => {}),
				});

				const { container } = renderExtensionWithProvider(providers);

				expect(container.textContent).toEqual('extension');
			});
		});
	});
});
