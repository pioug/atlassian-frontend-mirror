import { PluginKey, Selection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';

export const selectionPluginKey = new PluginKey('selection');

export enum SelectionStyle {
  Border,
  BoxShadow,
  Background,
  Blanket,
}

export interface SelectionPluginState {
  /** Selected node class decorations */
  decorationSet: DecorationSet;
  /** Selection the decorations were built for */
  selection: Selection;
}

export interface SelectionPluginOptions {
  useLongPressSelection?: boolean;
}
