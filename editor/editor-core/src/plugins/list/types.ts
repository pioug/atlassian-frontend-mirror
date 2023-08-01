import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import type { FeatureFlags } from '@atlaskit/editor-common/types';

export const MAX_NESTED_LIST_INDENTATION = 6;
export interface ListState {
  bulletListActive: boolean;
  bulletListDisabled: boolean;
  orderedListActive: boolean;
  orderedListDisabled: boolean;
  decorationSet: DecorationSet; // used to add attributes representing indentation level
}

export type ListPluginOptions = Pick<
  FeatureFlags,
  | 'restartNumberedLists'
  | 'restartNumberedListsToolbar'
  | 'listNumberContinuity'
>;
