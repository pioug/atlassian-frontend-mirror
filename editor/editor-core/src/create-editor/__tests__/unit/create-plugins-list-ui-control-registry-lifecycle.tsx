import React from 'react';

import * as isSSRModule from '@atlaskit/editor-common/is-ssr';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset/builder';
import { EditorPluginInjectionAPI } from '@atlaskit/editor-common/preset/plugin-injection-api';
import ProviderFactory from '@atlaskit/editor-common/provider-factory/provider-factory';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { featureFlagsPlugin } from '@atlaskit/editor-plugins/feature-flags';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugins/ui-control-registry';
import { uiControlRegistryPlugin } from '@atlaskit/editor-plugins/ui-control-registry';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import { createDefaultPreset } from '../../../presets/default';
import type { EditorProps } from '../../../types/editor-props';
import createPluginsList from '../../create-plugins-list';
import ReactEditorView from '../../ReactEditorView';

const portalProviderAPI = {
	destroy: () => {},
	remove: (_key: string) => {},
	render: () => {},
};

const registrySentinel = { type: 'toolbar', key: 'registry-lifecycle-sentinel' } as const;

const createRegistryConsumer =
	(
		onProbeCreated: (probe: () => boolean) => void,
	): NextEditorPlugin<
		'registryConsumer',
		{ dependencies: [OptionalPlugin<UiControlRegistryPlugin>] }
	> =>
	({ api }) => {
		api?.uiControlRegistry?.actions.register([registrySentinel]);
		onProbeCreated(
			() =>
				api?.uiControlRegistry?.actions
					.getComponents(registrySentinel.key)
					.includes(registrySentinel) ?? false,
		);
		return { name: 'registryConsumer' };
	};

const createCustomPresetWithRegistryConsumer = (onProbeCreated: (probe: () => boolean) => void) =>
	new EditorPresetBuilder()
		.add([featureFlagsPlugin, {}])
		.add(basePlugin)
		.add(createRegistryConsumer(onProbeCreated));

const createPluginInjectionAPI = () =>
	new EditorPluginInjectionAPI({
		getEditorState: () => undefined,
		getEditorView: () => undefined,
	});

const createProps = (preset: ReturnType<typeof createCustomPresetWithRegistryConsumer>) => ({
	providerFactory: ProviderFactory.create({}),
	portalProviderAPI,
	nodeViewPortalProviderAPI: portalProviderAPI,
	onEditorCreated: () => {},
	onEditorDestroyed: () => {},
	editorProps: {} satisfies EditorProps,
	preset,
});

describe('createPluginsList ui control registry lifecycle', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('keeps the injected registry available through initial setup and preset reconfiguration', async () => {
		mockExpEnabled('platform_editor_ui_control_registry');
		mockExpDisabled('platform_editor_slash_command');
		let registryProbe = () => false;
		const setRegistryProbe = (probe: () => boolean) => {
			registryProbe = probe;
		};
		const initialPreset = createCustomPresetWithRegistryConsumer(setRegistryProbe);
		const nextPreset = createCustomPresetWithRegistryConsumer(setRegistryProbe);
		const { rerender } = renderWithIntl(<ReactEditorView {...createProps(initialPreset)} />);
		const initialAPI = await initialPreset.apiPromise;

		expect(initialAPI).toHaveProperty('uiControlRegistry');
		expect(registryProbe()).toBe(true);

		rerender(<ReactEditorView {...createProps(nextPreset)} />);
		const reconfiguredAPI = await nextPreset.apiPromise;

		expect(reconfiguredAPI).toBe(initialAPI);
		expect(reconfiguredAPI).toHaveProperty('uiControlRegistry');
		expect(registryProbe()).toBe(true);
	});

	it('adds the injected registry to custom presets during SSR setup', async () => {
		mockExpEnabled('platform_editor_ui_control_registry');
		jest.spyOn(isSSRModule, 'isSSR').mockReturnValue(true);
		let registryProbe = () => false;
		const preset = createCustomPresetWithRegistryConsumer((probe) => {
			registryProbe = probe;
		});

		renderWithIntl(<ReactEditorView {...createProps(preset)} />);

		expect(await preset.apiPromise).toHaveProperty('uiControlRegistry');
		expect(registryProbe()).toBe(true);
	});

	it.each([true, false])(
		'builds one default registry with core ownership set to %s',
		(coreOwnershipEnabled) => {
			if (coreOwnershipEnabled) {
				mockExpEnabled('platform_editor_ui_control_registry');
				mockExpDisabled('platform_editor_slash_command');
			} else {
				mockExpDisabled('platform_editor_ui_control_registry');
				mockExpEnabled('platform_editor_slash_command');
			}
			const preset = createDefaultPreset({});
			const plugins = createPluginsList(preset, {}, createPluginInjectionAPI());

			expect(preset.has(uiControlRegistryPlugin)).toBe(!coreOwnershipEnabled);
			expect(plugins.filter(({ name }) => name === 'uiControlRegistry')).toHaveLength(1);
		},
	);
});
