import { EditorPresetBuilder } from '@atlaskit/editor-common/preset/builder';
import { EditorPluginInjectionAPI } from '@atlaskit/editor-common/preset/plugin-injection-api';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugins/ui-control-registry';
import { uiControlRegistryPlugin } from '@atlaskit/editor-plugins/ui-control-registry';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import createPluginsList from '../../create-plugins-list';

describe('createPluginsList ui control registry', () => {
	const createPluginInjectionAPI = () =>
		new EditorPluginInjectionAPI({
			getEditorState: () => undefined,
			getEditorView: () => undefined,
		});

	const createRegistryConsumer =
		(
			onInitialize: (registryAvailable: boolean) => void,
		): NextEditorPlugin<
			'registryConsumer',
			{ dependencies: [OptionalPlugin<UiControlRegistryPlugin>] }
		> =>
		({ api }) => {
			onInitialize(Boolean(api?.uiControlRegistry));
			return { name: 'registryConsumer' };
		};

	it('adds the core registry before consumers with slash commands off', () => {
		mockExpEnabled('platform_editor_ui_control_registry');
		mockExpDisabled('platform_editor_slash_command');
		const api = createPluginInjectionAPI();
		const registryAvailableAtInitialization: boolean[] = [];
		const consumer = createRegistryConsumer((available) =>
			registryAvailableAtInitialization.push(available),
		);
		const preset = new EditorPresetBuilder().add(consumer);
		const apiResolver = preset.apiResolver;
		const initializedPlugins = jest.spyOn(api, 'onEditorPluginInitialized');
		let resolvedAPI: unknown;
		apiResolver.on((editorAPI) => {
			resolvedAPI = editorAPI;
		});

		const plugins = createPluginsList(preset, {}, api);

		expect(plugins.map(({ name }) => name)).toEqual(['uiControlRegistry', 'registryConsumer']);
		expect(initializedPlugins.mock.calls[0][0]).toBe(plugins[0]);
		expect(registryAvailableAtInitialization).toEqual([true]);
		expect(preset.has(uiControlRegistryPlugin)).toBe(false);
		expect(preset.apiResolver).toBe(apiResolver);
		expect(resolvedAPI).toBe(api.api());
	});

	it('keeps custom presets without a registry in control with slash commands on', () => {
		mockExpDisabled('platform_editor_ui_control_registry');
		mockExpEnabled('platform_editor_slash_command');
		const api = createPluginInjectionAPI();
		const registryAvailableAtInitialization: boolean[] = [];
		const preset = new EditorPresetBuilder().add(
			createRegistryConsumer((available) => registryAvailableAtInitialization.push(available)),
		);

		const plugins = createPluginsList(preset, {}, api);

		expect(plugins.map(({ name }) => name)).toEqual(['registryConsumer']);
		expect(registryAvailableAtInitialization).toEqual([false]);
	});

	it('keeps consumer registrations when a legacy preset adds its own registry later', () => {
		mockExpEnabled('platform_editor_ui_control_registry');
		const api = createPluginInjectionAPI();
		const component = { type: 'toolbar', key: 'registry-sentinel' } as const;
		const consumer: ReturnType<typeof createRegistryConsumer> = ({ api }) => {
			api?.uiControlRegistry?.actions.register([component]);
			return { name: 'registryConsumer' };
		};
		const legacyRegistry: NextEditorPlugin<
			'uiControlRegistry',
			{ pluginConfiguration: { enabled: boolean } }
		> = () => uiControlRegistryPlugin({ config: undefined });
		const preset = new EditorPresetBuilder().add(consumer).add([legacyRegistry, { enabled: true }]);
		const initializedPlugins = jest.spyOn(api, 'onEditorPluginInitialized');

		const plugins = createPluginsList(preset, {}, api);

		expect(plugins.map(({ name }) => name)).toEqual(['uiControlRegistry', 'registryConsumer']);
		expect(
			initializedPlugins.mock.calls.filter(([{ name }]) => name === 'uiControlRegistry'),
		).toEqual([[plugins[0]]]);
		expect(api.api().uiControlRegistry?.actions.getComponents(component.key)).toContain(component);
		expect(preset.has(legacyRegistry)).toBe(true);
	});

	it('keeps the explicit registry in preset order when the experiment is disabled', () => {
		mockExpDisabled('platform_editor_ui_control_registry');
		const api = createPluginInjectionAPI();
		const preset = new EditorPresetBuilder()
			.add(createRegistryConsumer(() => {}))
			.add(uiControlRegistryPlugin);

		const plugins = createPluginsList(preset, {}, api);

		expect(plugins.map(({ name }) => name)).toEqual(['registryConsumer', 'uiControlRegistry']);
		expect(api.api().uiControlRegistry).toBeDefined();
	});

	it('includes the core registry without an injection API when the experiment is enabled', () => {
		mockExpEnabled('platform_editor_ui_control_registry');
		const preset = new EditorPresetBuilder().add(createRegistryConsumer(() => {}));

		const plugins = createPluginsList(preset, {});

		expect(plugins.map(({ name }) => name)).toEqual(['uiControlRegistry', 'registryConsumer']);
	});

	it('keeps the preset list without an injection API when the experiment is disabled', () => {
		mockExpDisabled('platform_editor_ui_control_registry');
		const preset = new EditorPresetBuilder().add(createRegistryConsumer(() => {}));

		const plugins = createPluginsList(preset, {});

		expect(plugins.map(({ name }) => name)).toEqual(['registryConsumer']);
	});
});
