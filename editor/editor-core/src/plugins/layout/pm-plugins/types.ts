import type { Slice } from '@atlaskit/editor-prosemirror/model';
import type { PresetLayout } from '../types';

export type LayoutState = {
  pos: number | null;
  allowBreakout: boolean;
  addSidebarLayouts: boolean;
  selectedLayout: PresetLayout | undefined;
  allowSingleColumnLayout: boolean;
};
export type Change = { from: number; to: number; slice: Slice };
