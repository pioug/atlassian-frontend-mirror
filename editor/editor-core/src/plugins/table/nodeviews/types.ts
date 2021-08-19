import { Node as PmNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { EventDispatcher } from '../../../event-dispatcher';
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
  eventDispatcher: EventDispatcher;
  getPos: () => number;
  options?: TableOptions;
  tableRenderOptimization?: boolean;
}
