import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { DefaultExtensionProvider } from '@atlaskit/editor-common/extensions';
import type {
	ExtensionManifest,
	ExtensionModule,
	ExtensionProvider,
} from '@atlaskit/editor-common/extensions';
import { type PublicPluginAPI } from '@atlaskit/editor-common/types';
import * as analyticsUtil from '@atlaskit/editor-common/utils/analytics';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createFakeExtensionManifest } from '@atlaskit/editor-test-helpers/extensions';
import * as editorExperiments from '@atlaskit/tmp-editor-statsig/experiments';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import type EditorActions from '../../../actions';
import { extensionProviderToQuickInsertProvider } from '../../extensions';

function replaceCustomQuickInsertModules(
	manifest: ExtensionManifest,
	quickInsertModule: ExtensionModule,
): ExtensionManifest {
	manifest.modules.quickInsert = [quickInsertModule];
	return manifest;
}

function setup(customManifests: ExtensionManifest[] = []) {
	const dummyExtension1 = createFakeExtensionManifest({
		title: 'First dummy extension',
		type: 'com.atlassian.forge',
		extensionKey: 'first',
	});

	const dummyExtension2 = createFakeExtensionManifest({
		title: 'Second dummy extension',
		type: 'com.atlassian.forge',
		extensionKey: 'second',
	});

	return new DefaultExtensionProvider([dummyExtension1, dummyExtension2, ...customManifests]);
}

describe('#extensionProviderToQuickInsertProvider', () => {
	let dummyExtensionProvider: ExtensionProvider;
	beforeEach(() => {
		dummyExtensionProvider = setup();
	});
	it('should returns quickInsert items from all extensions', async () => {
		const quickInsertProvider = await extensionProviderToQuickInsertProvider(
			dummyExtensionProvider,
			{} as EditorActions,
			{ current: undefined },
		);

		const items = await quickInsertProvider.getItems();

		expect(items).toMatchObject([
			{ title: 'First dummy extension' },
			{ title: 'Second dummy extension' },
		]);
	});

	it('should create analytics event when inserted', async () => {
		const dummyExtensionProvider = setup();
		const createAnalyticsEvent = jest.fn(() => ({ fire() {} }));
		const quickInsertProvider = await extensionProviderToQuickInsertProvider(
			dummyExtensionProvider,
			{} as EditorActions,
			{ current: undefined },
			createAnalyticsEvent as unknown as CreateUIAnalyticsEvent,
		);

		const items = await quickInsertProvider.getItems();

		items[0].action(jest.fn(), {} as EditorState);

		expect(createAnalyticsEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				action: 'inserted',
				actionSubject: 'document',
				actionSubjectId: 'extension',
				attributes: {
					extensionType: 'com.atlassian.forge',
					extensionKey: 'first',
					key: 'first:default',
					inputMethod: 'quickInsert',
				},
				eventType: 'track',
			}),
		);
	});

	it('should have access to the extensionAPI in the action', async () => {
		const createAnalyticsEvent = jest.fn(() => ({ fire() {} }));
		const mockAction = jest.fn();
		const mockAPI = {
			extension: { actions: { api: () => 'fake extension API' } },
		} as unknown as PublicPluginAPI<[ExtensionPlugin]>;
		const dummyExtensionProvider = replaceCustomQuickInsertModules(
			createFakeExtensionManifest({
				title: 'Action that uses extensionAPI',
				type: 'com.atlassian.forge',
				extensionKey: 'action-with-extensionAPI',
			}),
			{
				key: 'default-async',
				action: mockAction,
			},
		);
		const quickInsertProvider = await extensionProviderToQuickInsertProvider(
			setup([dummyExtensionProvider]),
			{
				replaceSelection: () => {},
			} as unknown as EditorActions,
			{ current: mockAPI },
			createAnalyticsEvent as unknown as CreateUIAnalyticsEvent,
		);
		const items = await quickInsertProvider.getItems();

		items[2].action(jest.fn(), {} as EditorState);

		expect(mockAction).toHaveBeenCalledWith('fake extension API');
	});

	it('should create analytics with inputMethod as toolbar event when inserted', async () => {
		const dummyExtensionProvider = setup();
		const createAnalyticsEvent = jest.fn(() => ({ fire() {} }));
		const quickInsertProvider = await extensionProviderToQuickInsertProvider(
			dummyExtensionProvider,
			{} as EditorActions,
			{ current: undefined },
			createAnalyticsEvent as unknown as CreateUIAnalyticsEvent,
		);

		const items = await quickInsertProvider.getItems();

		items[0].action(jest.fn(), {} as EditorState, INPUT_METHOD.TOOLBAR);

		expect(createAnalyticsEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				action: 'inserted',
				actionSubject: 'document',
				actionSubjectId: 'extension',
				attributes: {
					extensionType: 'com.atlassian.forge',
					extensionKey: 'first',
					key: 'first:default',
					inputMethod: 'toolbar',
				},
				eventType: 'track',
			}),
		);
	});

	describe('with an async quickInsert item', () => {
		beforeEach(() => {
			const asyncDummyExtension3 = replaceCustomQuickInsertModules(
				createFakeExtensionManifest({
					title: 'Async dummy extension',
					type: 'com.atlassian.forge',
					extensionKey: 'async',
				}),
				{
					key: 'default-async',
					action: () =>
						Promise.resolve({
							__esModule: true,
							default: { type: 'br' },
						}),
				},
			);

			dummyExtensionProvider = setup([asyncDummyExtension3]);
		});

		it('should create analytics event when inserted async', async () => {
			const createAnalyticsEvent = jest.fn(() => ({ fire() {} }));
			const mockAPI = { extension: { actions: { api: () => ({}) } } } as PublicPluginAPI<
				[ExtensionPlugin]
			>;
			const quickInsertProvider = await extensionProviderToQuickInsertProvider(
				dummyExtensionProvider,
				{ replaceSelection: () => {} } as unknown as EditorActions,
				{
					current: mockAPI,
				},
				createAnalyticsEvent as unknown as CreateUIAnalyticsEvent,
			);

			const items = await quickInsertProvider.getItems();

			items[2].action(jest.fn(), {} as EditorState);

			// We need to wait for the next tick, to resolve the external module.
			await new Promise((resolve) => process.nextTick(resolve));

			expect(createAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'inserted',
					actionSubject: 'document',
					actionSubjectId: 'extension',
					attributes: {
						extensionKey: 'async',
						extensionType: 'com.atlassian.forge',
						key: 'async:default-async',
						inputMethod: 'quickInsert',
					},
					eventType: 'track',
				}),
			);
		});

		ffTest.on(
			'platform_nested_nbm_analytics_location',
			'insertLocation enabled for extension insertions',
			() => {
				afterEach(() => {
					jest.restoreAllMocks();
				});

				it('should add the insertLocation attribute as the parent node for text selection', async () => {
					const dummyExtensionProvider = setup();
					const createAnalyticsEvent = jest.fn(() => ({ fire() {} }));
					const quickInsertProvider = await extensionProviderToQuickInsertProvider(
						dummyExtensionProvider,
						{} as EditorActions,
						{ current: undefined },
						createAnalyticsEvent as unknown as CreateUIAnalyticsEvent,
					);

					const findLocationSpy = jest.spyOn(analyticsUtil, 'findInsertLocation');
					findLocationSpy.mockReturnValue('panel');

					const items = await quickInsertProvider.getItems();

					items[0].action(jest.fn(), {} as EditorState);

					expect(createAnalyticsEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'inserted',
							actionSubject: 'document',
							actionSubjectId: 'extension',
							attributes: {
								extensionType: 'com.atlassian.forge',
								extensionKey: 'first',
								key: 'first:default',
								inputMethod: 'quickInsert',
								insertLocation: 'panel',
							},
							eventType: 'track',
						}),
					);
				});

				describe('platform_editor_nested_non_bodied_macros experiment exposure', () => {
					let experimentSpy: jest.SpyInstance;

					beforeEach(() => {
						experimentSpy = jest.spyOn(editorExperiments, 'editorExperiment');
					});

					afterEach(() => {
						experimentSpy.mockRestore();
					});
					it.each(['panel', 'blockquote', 'listItem', 'nestedExpand'])(
						'should fire platform_editor_nested_non_bodied_macros experiment exposure for $s',
						async (location) => {
							const dummyExtensionProvider = setup();
							const createAnalyticsEvent = jest.fn(() => ({ fire() {} }));
							const quickInsertProvider = await extensionProviderToQuickInsertProvider(
								dummyExtensionProvider,
								{} as EditorActions,
								{ current: undefined },
								createAnalyticsEvent as unknown as CreateUIAnalyticsEvent,
							);

							const findLocationSpy = jest.spyOn(analyticsUtil, 'findInsertLocation');
							findLocationSpy.mockReturnValue(location);

							const items = await quickInsertProvider.getItems();

							items[0].action(jest.fn(), {} as EditorState);

							expect(experimentSpy).toHaveBeenCalledWith(
								'platform_editor_nested_non_bodied_macros',
								'test',
								{
									exposure: true,
								},
							);
						},
					);

					it.each(['table', 'doc'])(
						'should not fire platform_editor_nested_non_bodied_macros experiment exposure for $s',
						async (location) => {
							const dummyExtensionProvider = setup();
							const createAnalyticsEvent = jest.fn(() => ({ fire() {} }));
							const quickInsertProvider = await extensionProviderToQuickInsertProvider(
								dummyExtensionProvider,
								{} as EditorActions,
								{ current: undefined },
								createAnalyticsEvent as unknown as CreateUIAnalyticsEvent,
							);

							const findLocationSpy = jest.spyOn(analyticsUtil, 'findInsertLocation');
							findLocationSpy.mockReturnValue(location);

							const items = await quickInsertProvider.getItems();

							items[0].action(jest.fn(), {} as EditorState);

							expect(experimentSpy).not.toHaveBeenCalledWith(
								'platform_editor_nested_non_bodied_macros',
								'test',
								{
									exposure: true,
								},
							);
						},
					);
				});
			},
		);
	});
});
