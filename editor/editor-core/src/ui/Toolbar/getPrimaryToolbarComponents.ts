import type {
	OptionalPlugin,
	PublicPluginAPI,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types/toolbar';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugins/primary-toolbar';

// Primary toolbar doesn't actually use plugin state so the state selector doesn't update as intended
// We need a proper API to deal with non-prosemirror based state in plugins but until then we can retrieve
// the latest
export const getPrimaryToolbarComponents = (
	editorAPI: PublicPluginAPI<[OptionalPlugin<PrimaryToolbarPlugin>]> | undefined,
	components: ToolbarUIComponentFactory[] | undefined,
): {
	components: ToolbarUIComponentFactory[] | undefined;
} => {
	return {
		components: components ?? editorAPI?.primaryToolbar?.sharedState.currentState()?.components,
	};
};
