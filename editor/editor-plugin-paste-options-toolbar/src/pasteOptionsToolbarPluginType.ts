import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { PastePlugin } from '@atlaskit/editor-plugin-paste';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry';

import type { ToolbarDropdownOption } from './types/types';
import type { PasteMenuRuleFactories } from './ui/utils/paste-menu-rules/types';

export type PasteOptionsToolbarPluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	PastePlugin,
	OptionalPlugin<UiControlRegistryPlugin>,
];

export interface PasteOptionsToolbarSharedState {
	isPlainText: boolean;
	pasteAncestorNodeNames: string[];
	pasteEndPos: number;
	pasteStartPos: number;
	plaintextLength: number;
	selectedOption: ToolbarDropdownOption;
	showLegacyOptions: boolean;
	showToolbar: boolean;
}

export type PasteOptionsToolbarPlugin = NextEditorPlugin<
	'pasteOptionsToolbarPlugin',
	{
		actions: {
			/**
			 * Returns the collection of paste-menu rule factories.
			 * External plugins (e.g. `editor-plugin-ai`, `editor-plugin-card`) use
			 * this to compose `isHidden` callbacks without static cross-package
			 * imports.
			 *
			 * @example
			 * const { minCharsRule, allRules } =
			 *   api.pasteOptionsToolbarPlugin.actions.getPasteMenuRules();
			 */
			getPasteMenuRules: () => PasteMenuRuleFactories;
		};
		dependencies: PasteOptionsToolbarPluginDependencies;
		pluginConfiguration?: {
			usePopupBasedPasteActionsMenu?: boolean;
		};
		sharedState: PasteOptionsToolbarSharedState;
	}
>;
