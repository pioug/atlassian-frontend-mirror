import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';

export type ReleaseHiddenDecoration = () => boolean | undefined;

export type SelectionMarkerPlugin = NextEditorPlugin<
  'selectionMarker',
  {
    dependencies: [FocusPlugin, OptionalPlugin<TypeAheadPlugin>];
    sharedState: { isForcedHidden: boolean } | undefined;
    actions: {
      hideDecoration: () => ReleaseHiddenDecoration | undefined;
    };
  }
>;
