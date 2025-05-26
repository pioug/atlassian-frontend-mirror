import React from 'react';
import { mount } from 'enzyme';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import BodiedExtension from '../../../../react/nodes/bodiedExtension';
import { ReactRenderer } from '../../../../index';

import type { RendererContext } from '../../../../react/types';
import ReactSerializer from '../../../../react';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/extensions';
import Loadable from 'react-loadable';
import { act } from 'react-dom/test-utils';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { render, screen } from '@testing-library/react';
import { adfNestedTableData } from '../../../__fixtures__/nested-tables';

describe('Renderer - React/Nodes/BodiedExtension', () => {
	const providerFactory = ProviderFactory.create({});
	const extensionHandlers: ExtensionHandlers = {
		'com.atlassian.fabric': (param: any) => {
			switch (param.extensionKey) {
				case 'react':
					return <p>This is a react element</p>;
				case 'adf':
					return [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'This is a ADF node',
								},
							],
						},
					];
				case 'originalContent':
					return param.content;
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

	const serializer = new ReactSerializer({});

	it('should be able to fall back to default content', () => {
		const extension = mount(
			<BodiedExtension
				providers={providerFactory}
				serializer={serializer}
				extensionHandlers={extensionHandlers}
				rendererContext={rendererContext}
				extensionType="com.atlassian.fabric"
				extensionKey="default"
				localId="c145e554-f571-4208-a0f1-2170e1987722"
				startPos={1}
			>
				<p>This is the default content of the extension</p>
			</BodiedExtension>,
		);

		expect(extension.find('div').first().text()).toEqual(
			'This is the default content of the extension',
		);
		extension.unmount();
	});

	it('should be able to render React.Element from extensionHandler', () => {
		const extension = mount(
			<BodiedExtension
				providers={providerFactory}
				serializer={serializer}
				extensionHandlers={extensionHandlers}
				rendererContext={rendererContext}
				extensionType="com.atlassian.fabric"
				extensionKey="react"
				localId="c145e554-f571-4208-a0f1-2170e1987722"
				startPos={1}
			/>,
		);

		expect(extension.find('div').first().text()).toEqual('This is a react element');
		extension.unmount();
	});

	it('should render the default content if extensionHandler throws an exception', () => {
		const extension = mount(
			<BodiedExtension
				providers={providerFactory}
				serializer={serializer}
				extensionHandlers={extensionHandlers}
				rendererContext={rendererContext}
				extensionType="com.atlassian.fabric"
				extensionKey="error"
				localId="c145e554-f571-4208-a0f1-2170e1987722"
				startPos={1}
			>
				<p>This is the default content of the extension</p>
			</BodiedExtension>,
		);

		expect(extension.find('div').first().text()).toEqual(
			'This is the default content of the extension',
		);
		extension.unmount();
	});

	it('extension handler should receive type = bodiedExtension', () => {
		const extensionHandler = jest.fn();
		const extensionHandlers: ExtensionHandlers = {
			'com.atlassian.fabric': extensionHandler,
		};

		const fragmentLocalId = 'fragment-local-id';
		const fragmentMark = rendererContext.schema!.marks.fragment.create({
			localId: fragmentLocalId,
		});

		const extension = mount(
			<BodiedExtension
				providers={providerFactory}
				serializer={serializer}
				extensionHandlers={extensionHandlers}
				rendererContext={rendererContext}
				extensionType="com.atlassian.fabric"
				extensionKey="react"
				localId="c145e554-f571-4208-a0f1-2170e1987722"
				marks={[fragmentMark]}
				startPos={1}
			/>,
		);

		expect(extensionHandler.mock.calls[0][0]).toEqual({
			type: 'bodiedExtension',
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
			'expand',
			ExtensionHandlerFromProvider,
		);

		const providers = ProviderFactory.create({
			extensionProvider: Promise.resolve(
				combineExtensionProviders([confluenceMacrosExtensionProvider]),
			),
		});

		it('should be able to render extensions with the extension provider', async () => {
			const extension = mount(
				<BodiedExtension
					providers={providers}
					serializer={serializer}
					extensionHandlers={extensionHandlers}
					rendererContext={rendererContext}
					extensionType="fake.confluence"
					extensionKey="expand"
					content="body"
					localId="c145e554-f571-4208-a0f1-2170e1987722"
					startPos={1}
				/>,
			);

			await act(async () => {
				await Loadable.preloadAll();
			});

			extension.update();

			expect(extension.text()).toEqual('Extension provider: body');

			extension.unmount();
		});

		it('should prioritize extension handlers (sync) over extension provider', async () => {
			const extensionHandlers: ExtensionHandlers = {
				'fake.confluence': (node: any) => <div>Extension handler: {node.content}</div>,
			};

			const extension = mount(
				<BodiedExtension
					providers={providers}
					serializer={serializer}
					extensionHandlers={extensionHandlers}
					rendererContext={rendererContext}
					extensionType="fake.confluence"
					extensionKey="expand"
					content="body"
					localId="c145e554-f571-4208-a0f1-2170e1987722"
					startPos={1}
				/>,
			);

			expect(extension.text()).toEqual('Extension handler: body');

			extension.unmount();
		});

		it('should fallback to extension provider if not handled by the extension handler', async () => {
			const extensionHandlers: ExtensionHandlers = {
				'fake.confluence': (node: any) => null,
			};

			const extension = mount(
				<BodiedExtension
					providers={providers}
					serializer={serializer}
					extensionHandlers={extensionHandlers}
					rendererContext={rendererContext}
					extensionType="fake.confluence"
					extensionKey="expand"
					content="body"
					localId="c145e554-f571-4208-a0f1-2170e1987722"
					startPos={1}
				/>,
			);

			await act(async () => {
				await Loadable.preloadAll();
			});

			extension.update();

			expect(extension.text()).toEqual('Extension provider: body');

			extension.unmount();
		});
	});

	eeTest.describe('comment_on_bodied_extensions', 'Commenting features').variant(true, () => {
		it('should render bodied extensions with incremented start positions when inside a document', async () => {
			const providerFactory = ProviderFactory.create({});

			const extensionHandlers: ExtensionHandlers = {
				'fake.confluence': (ext) => {
					return (
						<ReactRenderer
							adfStage="stage0"
							document={{ type: 'doc', version: 1, content: ext.content as any }}
							allowAnnotations={false}
						/>
					);
				},
			};

			const startPos = 10;

			const extension = mount(
				<BodiedExtension
					providers={providerFactory}
					serializer={serializer}
					extensionHandlers={extensionHandlers}
					rendererContext={rendererContext}
					extensionType="fake.confluence"
					extensionKey="expand"
					content={[
						{
							type: 'paragraph',
							content: [{ type: 'text', text: 'This is a ADF node' }],
						},
					]}
					localId="c145e554-f571-4208-a0f1-2170e1987722"
					startPos={startPos}
				/>,
			);

			await act(async () => {
				await Loadable.preloadAll();
			});

			extension.update();

			// The paragraph inside the extension should have a data-renderer-start-pos attribute with the incremented value
			expect(extension.html()).toContain(`data-renderer-start-pos="${startPos + 1}"`);

			extension.unmount();
		});
	});

	describe('bodiedExtension nested renderer validation', () => {
		const testRendererContext = { ...rendererContext, adDoc: adfNestedTableData };
		ffTest.on(
			'platform_editor_nested_table_extension_comment_fix',
			'nested tables in nested renderers fix is enabled',
			() => {
				it('should allow nested tables in nested renderers', () => {
					const providerFactory = ProviderFactory.create({});
					const extensionHandlers: ExtensionHandlers = {
						'fake.confluence': (ext) => {
							return (
								<ReactRenderer
									adfStage="stage0"
									document={{ type: 'doc', version: 1, content: ext.content as any }}
									allowAnnotations={false}
									useSpecBasedValidator
								/>
							);
						},
					};
					render(
						<BodiedExtension
							providers={providerFactory}
							serializer={serializer}
							extensionHandlers={extensionHandlers}
							rendererContext={testRendererContext}
							extensionType="fake.confluence"
							extensionKey="expand"
							content={adfNestedTableData.content}
							localId="c145e554-f571-4208-a0f1-2170e1987722"
							startPos={1}
						/>,
					);
					expect(screen.getAllByRole('table')).toHaveLength(2);
				});
			},
		);
		ffTest.off(
			'platform_editor_nested_table_extension_comment_fix',
			'nested tables in nested renderers fix is enabled',
			() => {
				it('should not allow nested tables in nested renderers', async () => {
					const providerFactory = ProviderFactory.create({});
					const extensionHandlers: ExtensionHandlers = {
						'fake.confluence': (ext) => {
							return (
								<ReactRenderer
									adfStage="stage0"
									document={{ type: 'doc', version: 1, content: ext.content as any }}
									allowAnnotations={false}
									useSpecBasedValidator
								/>
							);
						},
					};
					render(
						<BodiedExtension
							providers={providerFactory}
							serializer={serializer}
							extensionHandlers={extensionHandlers}
							rendererContext={testRendererContext}
							extensionType="fake.confluence"
							extensionKey="expand"
							content={adfNestedTableData.content}
							localId="c145e554-f571-4208-a0f1-2170e1987722"
							startPos={1}
						/>,
					);
					expect(screen.getAllByRole('table')).toHaveLength(1);
					expect(
						screen.getByText('This editor does not support displaying this content: table'),
					).toBeInTheDocument();
				});
			},
		);
	});
});
