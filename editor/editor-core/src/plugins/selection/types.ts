import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
export type { SelectionPluginState } from '@atlaskit/editor-common/selection';
import type { LongPressSelectionPluginOptions } from '@atlaskit/editor-common/types';

export const selectionPluginKey = new PluginKey('selection');

export { RelativeSelectionPos };

export enum SelectionDirection {
  Before = -1,
  After = 1,
}

export interface SelectionPluginOptions
  extends LongPressSelectionPluginOptions {}
