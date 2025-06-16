import type {
	OptionalPlugin,
	PublicPluginAPI,
	ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugins/primary-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';

// Primary toolbar doesn't actually use plugin state so the state selector doesn't update as intended
// We need a proper API to deal with non-prosemirror based state in plugins but until then we can retrieve
// the latest
export const getPrimaryToolbarComponents = (
	editorAPI: PublicPluginAPI<[OptionalPlugin<PrimaryToolbarPlugin>]> | undefined,
	components: ToolbarUIComponentFactory[] | undefined,
) => {
	if (fg('platform_editor_setup_editorapi_sync')) {
		return {
			components: components ?? editorAPI?.primaryToolbar?.sharedState.currentState()?.components,
		};
	}
	return { components };
};
