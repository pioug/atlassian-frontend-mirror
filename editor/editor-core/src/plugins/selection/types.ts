import { PluginKey } from 'prosemirror-state';
import { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
export type { SelectionPluginState } from '@atlaskit/editor-common/selection';

export const selectionPluginKey = new PluginKey('selection');

export { RelativeSelectionPos };

export enum SelectionDirection {
  Before = -1,
  After = 1,
}
export interface LongPressSelectionPluginOptions {
  useLongPressSelection?: boolean;
}

export interface SelectionPluginOptions
  extends LongPressSelectionPluginOptions {}
