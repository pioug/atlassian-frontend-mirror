import type { FeatureFlagsPluginOptions } from '@atlaskit/editor-plugin-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

interface Props {
	options: never;
}

export function featureFlagsPluginOptions({}: Props): FeatureFlagsPluginOptions {
	/**
	 * @private
	 * @deprecated Don't add any new feature flags here!
	 *             If you need a new feature flag, use:
	 *             - {@link editorExperiment} for new experiments.
	 *             - {@link fg} for new feature gates.
	 */
	return {
		// SECTION: From confluence/next/packages/editor-features/src/hooks/useEditorFeatureFlags.ts
		/**
		 * This feature flag has completed rollout in Confluence and is to be cleaned up from LD
		 * but cannot yet be cleaned up from editor component as pending rollout in other products first
		 */
		lpLinkPicker: true,
		tableDragAndDrop: true,
		tableWithFixedColumnWidthsOption: true,
		// END SECTION

		// SECTION: From confluence/next/packages/full-page-editor/src/hooks/useEditorFullPageExperiments.ts
		tableSelector: editorExperiment('platform_editor_tables_table_selector', true),
		macroInteractionUpdates: true,
		moreElementsInQuickInsertView: true,
		// END SECTION

		// SECTION: From confluence/next/packages/editor-presets/src/utils/createFeatureFlagsFromProps.ts
		catchAllTracking: false,
		showAvatarGroupAsPlugin: false,
		errorBoundaryDocStructure: false,
		synchronyErrorDocStructure: false,
		enableViewUpdateSubscription: false,
		collabAvatarScroll: false,
		twoLineEditorToolbar: false,
		disableSpellcheckByBrowser: undefined,
		// END SECTION
	};
}
