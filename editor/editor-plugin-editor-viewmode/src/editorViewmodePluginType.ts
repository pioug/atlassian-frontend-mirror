import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

export type EditorViewModePluginState = {
	/**
	 * Content mode is the mode that the editor is in for the content.
	 *
	 * Content mode is different from the consumption mode -- where you can be in edit mode
	 * but still in consumption mode. This is sometimes referred to as the 'graceful edit' mode.
	 */
	contentMode: ContentMode;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
	/**
	 * @deprecated
	 *
	 * This property is misleading and should be avoided as mode is now an internal state
	 * - with the editor having consumption first state while in edit mode for live pages.
	 *
	 * For legacy uses -- use the equivalent isConsumption value
	 * - mode: 'edit' => isConsumption: false
	 * - mode: 'view' => isConsumption: true
	 *
	 * For new uses -- you are probably looking for isConsumption or contentMode.
	 **/
	mode: ViewMode;

	/**
	 * Indicates if the editor is in a state that content should be in a consumption mode
	 * - nodes such as tables have a different appearance in consumption mode
	 * - no cursor is set in the editor when in consumption mode
	 */
	isConsumption: boolean;
	/**
	 * This is for a variant where the editor starts in edit mode and intent to edit only triggers the top toolbar visibility.
	 */
	_showTopToolbar?: boolean;
};

export type ViewMode = 'edit' | 'view';

/**
 * - edit: Traditional edit mode (lands in editing mode)
 * - live-edit: Edit mode for live pages (lands in consumption mode, and on intent to edit goes into full editing mode)
 * - view: View mode for live pages (lands in consumption mode)
 * - view-only: View only mode for live pages (lands in consumption mode), no editing allowed
 */
export type ContentMode = 'edit' | 'live-edit' | 'live-view' | 'live-view-only';

export type EditorViewModePluginConfig = {
	/**
	 * @default 'edit'
	 */
	initialContentMode?: ContentMode;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
	/**
	 * Note: This property is deprecated and should be avoided -- use initialContentMode instead.
	 * @deprecated
	 */
	mode?: ViewMode;
};

export type UpdateContentModeAction =
	| { type: 'intent-to-edit' }
	| { type: 'switch-content-mode'; contentMode: 'live-edit' | 'live-view' };

export type EditorViewModePlugin = NextEditorPlugin<
	'editorViewMode',
	{
		sharedState: EditorViewModePluginState | null;
		dependencies: [];
		pluginConfiguration?: EditorViewModePluginConfig;
		commands: {
			// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
			/**
			 * @deprecated
			 * This command is deprecated and should be avoided -- use updateContentMode instead.
			 */
			updateViewMode: (mode: ViewMode) => EditorCommand;
			updateContentMode: (action: UpdateContentModeAction) => EditorCommand;
		};
	}
>;
