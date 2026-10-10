import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations/decorationsPluginType';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled/editorDisabledPluginType';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus/focusPluginType';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead/type-ahead-plugin-type';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent/user-intent-plugin-type';

export type ReleaseHiddenDecoration = () => boolean | undefined;

type SetCleanup = (cb: ReleaseHiddenDecoration | undefined) => void;
type CancelQueue = (() => void) | undefined;

export type SelectionMarkerPluginOptions = { hideCursorOnInit?: boolean };

/**
 * @private
 * @deprecated Use {@link SelectionMarkerPluginOptions} instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type SelectionMarkerPluginConfiguration = SelectionMarkerPluginOptions;

export type SelectionMarkerPlugin = NextEditorPlugin<
	'selectionMarker',
	{
		actions: {
			hideDecoration: () => ReleaseHiddenDecoration | undefined;
			queueHideDecoration: (setCleanup: SetCleanup) => CancelQueue;
		};
		dependencies: [
			FocusPlugin,
			OptionalPlugin<TypeAheadPlugin>,
			OptionalPlugin<EditorDisabledPlugin>,
			OptionalPlugin<ToolbarPlugin>,
			OptionalPlugin<DecorationsPlugin>,
			OptionalPlugin<UserIntentPlugin>,
		];
		pluginConfiguration?: SelectionMarkerPluginOptions;
		sharedState: { isForcedHidden: boolean; isMarkerActive: boolean } | undefined;
	}
>;
