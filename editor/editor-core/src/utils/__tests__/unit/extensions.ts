import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	ExtensionManifest,
	ExtensionModule,
	ExtensionProvider,
} from '@atlaskit/editor-common/extensions';
import { DefaultExtensionProvider } from '@atlaskit/editor-common/extensions';
import { type PublicPluginAPI } from '@atlaskit/editor-common/types';
import { findInsertLocation } from '@atlaskit/editor-common/utils/analytics';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createFakeExtensionManifest } from '@atlaskit/editor-test-helpers/extensions';
import { fg } from '@atlaskit/platform-feature-flags';

import type EditorActions from '../../../actions';
import { extensionProviderToQuickInsertProvider } from '../../extensions';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

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

jest.mock('@atlaskit/editor-common/utils/analytics');

afterEach(() => {
	jest.restoreAllMocks();
});

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
		const createAnalyticsEvent = jest.fn(() => ({
			fire() {},
		}));
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
		const createAnalyticsEvent = jest.fn(() => ({
			fire() {},
		}));
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

	it('should still run the action in the provider if extension plugin not attached', async () => {
		const createAnalyticsEvent = jest.fn(() => ({
			fire() {},
		}));
		const mockAction = jest.fn();
		const mockAPI = {} as unknown as PublicPluginAPI<[ExtensionPlugin]>;
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

		expect(mockAction).toHaveBeenCalled();
	});

	it('should warn when trying to use a method on the extension API', async () => {
		const createAnalyticsEvent = jest.fn(() => ({
			fire() {},
		}));
		const mockAction = jest.fn().mockImplementation((api) => {
			api.editInContextPanel();
		});
		const mockAPI = {} as unknown as PublicPluginAPI<[ExtensionPlugin]>;
		const warnSpy = jest.spyOn(console, 'warn');
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

		expect(mockAction).toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith(
			'Extension plugin not attached to editor - cannot use extension API in editInContextPanel',
		);
	});

	it('should create analytics with inputMethod as toolbar event when inserted', async () => {
		const dummyExtensionProvider = setup();
		const createAnalyticsEvent = jest.fn(() => ({
			fire() {},
		}));
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
			const createAnalyticsEvent = jest.fn(() => ({
				fire() {},
			}));
			const mockAPI = { extension: { actions: { api: () => ({}) } } } as PublicPluginAPI<
				[ExtensionPlugin]
			>;
			const quickInsertProvider = await extensionProviderToQuickInsertProvider(
				dummyExtensionProvider,
				{
					replaceSelection: () => {},
				} as unknown as EditorActions,
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

		it('should add the insertLocation attribute as the parent node for text selection', async () => {
			const dummyExtensionProvider = setup();
			const createAnalyticsEvent = jest.fn(() => ({
				fire() {},
			}));
			const quickInsertProvider = await extensionProviderToQuickInsertProvider(
				dummyExtensionProvider,
				{} as EditorActions,
				{ current: undefined },
				createAnalyticsEvent as unknown as CreateUIAnalyticsEvent,
			);

			jest.mocked(findInsertLocation).mockReturnValue('panel');

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
	});

	describe('key parsing & passthrough via `getItems()`', () => {
		it('should include key property', async () => {
			const quickInsertProvider = await extensionProviderToQuickInsertProvider(
				dummyExtensionProvider,
				{} as EditorActions,
				{ current: undefined },
			);

			const items = await quickInsertProvider.getItems();

			expect(items[0]).toHaveProperty('key', 'first:default');
			expect(items[1]).toHaveProperty('key', 'second:default');
		});
	});

	describe('lozenge passthrough via `getItems()`', () => {
		it('should include lozenge on quick insert item when extension module has lozenge', async () => {
			const lozengeContent = 'New';
			const extensionWithLozenge = replaceCustomQuickInsertModules(
				createFakeExtensionManifest({
					title: 'Extension with lozenge',
					type: 'com.atlassian.forge',
					extensionKey: 'with-lozenge',
				}),
				{
					key: 'default',
					action: jest.fn(),
					lozenge: lozengeContent,
				},
			);

			const provider = setup([extensionWithLozenge]);

			const quickInsertProvider = await extensionProviderToQuickInsertProvider(
				provider,
				{} as EditorActions,
				{ current: undefined },
			);

			const items = await quickInsertProvider.getItems();

			// First two items are from default dummy extensions, third is our custom one
			expect(items[2]).toHaveProperty('lozenge', lozengeContent);
		});
	});

	describe('priority parsing & passthrough via `getItems()`', () => {
		it('should include priority property when feature gate is enabled and priority is set', async () => {
			const mockFg = fg as jest.MockedFunction<typeof fg>;
			mockFg.mockImplementation((gateName) => {
				if (
					gateName === 'cc_fd_wb_create_priority_in_slash_menu_enabled' ||
					gateName === 'rovo_chat_enable_skills_ui_m1'
				) {
					return true;
				}
				return false;
			});

			// Create extensions with priority values
			const extensionWithPriority1 = replaceCustomQuickInsertModules(
				createFakeExtensionManifest({
					title: 'Extension with priority 100',
					type: 'com.atlassian.forge',
					extensionKey: 'priority-high',
				}),
				{
					key: 'default',
					priority: 100,
					action: jest.fn(),
				},
			);

			const extensionWithPriority2 = replaceCustomQuickInsertModules(
				createFakeExtensionManifest({
					title: 'Extension with priority 50',
					type: 'com.atlassian.forge',
					extensionKey: 'priority-medium',
				}),
				{
					key: 'default',
					priority: 50,
					action: jest.fn(),
				},
			);

			const priorityExtensionProvider = setup([extensionWithPriority1, extensionWithPriority2]);

			const quickInsertProvider = await extensionProviderToQuickInsertProvider(
				priorityExtensionProvider,
				{} as EditorActions,
				{ current: undefined },
			);

			const items = await quickInsertProvider.getItems();

			// Check that priority is included for extensions that have it set
			expect(items[2]).toHaveProperty('priority', 100);
			expect(items[3]).toHaveProperty('priority', 50);
		});

		it('should not include priority property when feature gate is disabled', async () => {
			const mockFg = fg as jest.MockedFunction<typeof fg>;
			mockFg.mockImplementation((gateName) => {
				if (
					gateName === 'cc_fd_wb_create_priority_in_slash_menu_enabled' ||
					gateName === 'rovo_chat_enable_skills_ui_m1'
				) {
					return false;
				}
				return false;
			});

			// Create extensions with priority values
			const extensionWithPriority = replaceCustomQuickInsertModules(
				createFakeExtensionManifest({
					title: 'Extension with priority',
					type: 'com.atlassian.forge',
					extensionKey: 'priority-test',
				}),
				{
					key: 'default',
					priority: 100,
					action: jest.fn(),
				},
			);

			const priorityExtensionProvider = setup([extensionWithPriority]);

			const quickInsertProvider = await extensionProviderToQuickInsertProvider(
				priorityExtensionProvider,
				{} as EditorActions,
				{ current: undefined },
			);

			const items = await quickInsertProvider.getItems();

			// Check that priority is not included when feature flag is disabled
			expect(items[2]).not.toHaveProperty('priority');
		});

		it('should not include priority property when feature gate is enabled but priority is not set', async () => {
			const mockFg = fg as jest.MockedFunction<typeof fg>;
			mockFg.mockImplementation((gateName) => {
				return (
					gateName === 'cc_fd_wb_create_priority_in_slash_menu_enabled' ||
					gateName === 'rovo_chat_enable_skills_ui_m1'
				);
			});

			const quickInsertProvider = await extensionProviderToQuickInsertProvider(
				dummyExtensionProvider,
				{} as EditorActions,
				{ current: undefined },
			);

			const items = await quickInsertProvider.getItems();

			// Check that priority is not included when not set on extension modules
			expect(items[0]).toHaveProperty('priority', undefined);
			expect(items[1]).toHaveProperty('priority', undefined);
		});
	});
});
