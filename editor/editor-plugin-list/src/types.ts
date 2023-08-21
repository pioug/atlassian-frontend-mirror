import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { Command, FeatureFlags } from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

type InputMethod = INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR;

export type ListPluginOptions = Pick<FeatureFlags, 'restartNumberedLists'>;

export type IndentList = (inputMethod: InputMethod) => Command;

export type OutdentList = (
  inputMethod: InputMethod,
  featureFlags: FeatureFlags,
) => Command;

export type ToggleOrderedList = (
  view: EditorView,
  inputMethod: InputMethod,
) => boolean;

export type ToggleBulletList = (
  view: EditorView,
  inputMethod: InputMethod,
) => boolean;

export type IsInsideListItem = (state: EditorState) => boolean;

export type FindRootParentListNode = ($pos: ResolvedPos) => ResolvedPos | null;

export interface ListState {
  bulletListActive: boolean;
  bulletListDisabled: boolean;
  orderedListActive: boolean;
  orderedListDisabled: boolean;
  decorationSet: DecorationSet; // used to add attributes representing indentation level
}

export type ListPlugin = NextEditorPlugin<
  'list',
  {
    pluginConfiguration: ListPluginOptions | undefined;
    dependencies: [
      typeof featureFlagsPlugin,
      OptionalPlugin<typeof analyticsPlugin>,
    ];
    actions: {
      indentList: IndentList;
      outdentList: OutdentList;
      toggleOrderedList: ToggleOrderedList;
      toggleBulletList: ToggleBulletList;
      isInsideListItem: IsInsideListItem;
      findRootParentListNode: FindRootParentListNode;
    };
    sharedState: ListState | undefined;
  }
>;
