import { PluginKey } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';

export const selectionPluginKey = new PluginKey('selection');

export enum SelectionStyle {
  Border,
  BoxShadow,
  Background,
  Blanket,
}

export interface SelectionPluginState {
  decorationSet: DecorationSet;
}

export interface SelectionPluginOptions {
  useLongPressSelection?: boolean;
}
