import type { EditorContainerWidth, NextEditorPlugin, PublicPluginAPI } from '../types';

// Warning: Duplicate type
// Workaround as we don't want to import this package into `editor-common`
// We'll get type errors if this gets out of sync with `editor-plugin-width`.
// TODO: ED-17836 - Remove extension workaround
// When we remove the workaround for `WithPluginState` we can possibly refactor
// and bring the width state information outside of the component
type WidthPluginType = NextEditorPlugin<'width', { sharedState: EditorContainerWidth | undefined }>;

export type ExtensionsPluginInjectionAPI = PublicPluginAPI<[WidthPluginType]> | undefined;

export type MacroInteractionDesignFeatureFlags = {
	showMacroInteractionDesignUpdates?: boolean;
};
