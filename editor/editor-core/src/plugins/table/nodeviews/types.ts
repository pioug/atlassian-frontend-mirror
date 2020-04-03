import { Node as PmNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { PortalProviderAPI } from '../../../ui/PortalProvider';

export type TableOptions = {
  dynamicTextSizing?: boolean;
  isBreakoutEnabled?: boolean;
  isFullWidthModeEnabled?: boolean;
  wasFullWidthModeEnabled?: boolean;
};

export interface Props {
  node: PmNode;
  view: EditorView;
  allowColumnResizing?: boolean;
  cellMinWidth?: number;
  portalProviderAPI: PortalProviderAPI;
  getPos: () => number;
  options?: TableOptions;
}
