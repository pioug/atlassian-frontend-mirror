import { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
export type { SelectionPluginState } from '@atlaskit/editor-common/selection';
import type { LongPressSelectionPluginOptions } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type {
  EditorState,
  Selection,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

export const selectionPluginKey = new PluginKey('selection');

export { RelativeSelectionPos };

export enum SelectionDirection {
  Before = -1,
  After = 1,
}

export type SetSelectionRelativeToNode = (props: {
  selectionRelativeToNode?: RelativeSelectionPos;
  selection?: Selection | null;
}) => (state: EditorState) => Transaction;

export type EditorSelectionAPI = {
  selectNearNode: SetSelectionRelativeToNode;
};

export interface SelectionPluginOptions
  extends LongPressSelectionPluginOptions {}
