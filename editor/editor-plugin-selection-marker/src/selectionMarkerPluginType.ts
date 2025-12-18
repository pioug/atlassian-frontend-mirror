import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';

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
