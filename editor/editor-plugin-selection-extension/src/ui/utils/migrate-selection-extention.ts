import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { ExtensionMenuItemConfiguration, SelectionExtension } from '../../types';

/**
 *
 * TODO: ED-29157 - remove once Confluence migrates to `extensionList`API
 *
 * NOTES:
 * - This is temporary until we deprecate SelectionExtension and DynamicSelectionExtension.
 * - Only supporing SelectionExtension as DynamicSelectionExtension is not being used and will be deprecated.
 *
 * Converts a SelectionExtension -> ExtensionMenuItemConfiguration. This allows existing extensions to appear in the new toolbar.
 */
export const migrateSelectionExtensionToMenuItem = (
	extension: SelectionExtension,
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined,
): ExtensionMenuItemConfiguration | undefined => {
	if (!extension.icon) {
		return undefined;
	}

	// Warning! These are inlined because the onClick handler must have up to date references to selection (which is awkwaradly set during extension.onClick invocation).
	const getSelection = () => {
		const sharedState = api?.selectionExtension.sharedState.currentState();
		return sharedState?.activeExtension?.selection;
	};

	return {
		label: extension.name,
		icon: extension.icon,
		isDisabled:
			extension.isDisabled &&
			extension.isDisabled({
				selection: getSelection(),
				// pass undefined as no consumers use this
				selectedNodeAdf: undefined,
				selectionRanges: undefined,
			}),
		/**
		 * SelectionExtension supports passing through selection, selectionAdf, and selectionRanges.
		 *
		 * To support backwards compatibility wrap the onClick with these parameters here and let MenuItem invoke onClick using its expected signature.
		 */
		onClick: () => {
			const selectionAdf = api?.selectionExtension.actions.getSelectionAdf();

			extension.onClick &&
				extension.onClick({
					selection: getSelection(),
					selectedNodeAdf: selectionAdf?.selectedNodeAdf,
					selectionRanges: selectionAdf?.selectionRanges,
				});
		},

		contentComponent: extension.component,
	};
};
