import { Slice } from 'prosemirror-model';
import { PresetLayout } from '../types';

export type LayoutState = {
  pos: number | null;
  allowBreakout: boolean;
  addSidebarLayouts: boolean;
  selectedLayout: PresetLayout | undefined;
  allowSingleColumnLayout: boolean;
};
export type Change = { from: number; to: number; slice: Slice };
