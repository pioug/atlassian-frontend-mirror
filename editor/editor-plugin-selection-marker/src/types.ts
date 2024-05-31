import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';

export type ReleaseHiddenDecoration = () => boolean | undefined;

export type SelectionMarkerPlugin = NextEditorPlugin<
	'selectionMarker',
	{
		dependencies: [
			FocusPlugin,
			OptionalPlugin<TypeAheadPlugin>,
			OptionalPlugin<EditorDisabledPlugin>,
		];
		sharedState: { isForcedHidden: boolean } | undefined;
		actions: {
			hideDecoration: () => ReleaseHiddenDecoration | undefined;
		};
	}
>;
