import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
  EditorCommand,
  FeatureFlags,
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

export type InputMethod = INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR;

export const MAX_NESTED_LIST_INDENTATION = 6;

export type ListPluginOptions = Pick<FeatureFlags, 'restartNumberedLists'>;

export type IndentList = (inputMethod: InputMethod) => EditorCommand;

export type OutdentList = (inputMethod: InputMethod) => EditorCommand;

export type ToggleOrderedList = (inputMethod: InputMethod) => EditorCommand;

export type ToggleBulletList = (inputMethod: InputMethod) => EditorCommand;

export type IsInsideListItem = (tr: Transaction) => boolean;

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
    dependencies: [FeatureFlagsPlugin, OptionalPlugin<AnalyticsPlugin>];
    actions: {
      isInsideListItem: IsInsideListItem;
      findRootParentListNode: FindRootParentListNode;
    };
    commands: {
      indentList: IndentList;
      outdentList: OutdentList;
      toggleOrderedList: ToggleOrderedList;
      toggleBulletList: ToggleBulletList;
    };
    sharedState: ListState | undefined;
  }
>;
