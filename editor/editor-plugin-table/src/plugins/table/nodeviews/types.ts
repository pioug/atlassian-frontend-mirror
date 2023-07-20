import { Node as PmNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal-provider';
import type {
  GetEditorContainerWidth,
  GetEditorFeatureFlags,
} from '@atlaskit/editor-common/types';

import type { PluginInjectionAPI } from '../types';

export type TableOptions = {
  isBreakoutEnabled?: boolean;
  isFullWidthModeEnabled?: boolean;
  wasFullWidthModeEnabled?: boolean;
  isTableResizingEnabled?: boolean;
};

export interface Props {
  node: PmNode;
  view: EditorView;
  allowColumnResizing?: boolean;
  cellMinWidth?: number;
  portalProviderAPI: PortalProviderAPI;
  eventDispatcher: EventDispatcher;
  getPos: () => number | undefined;
  options?: TableOptions;
  tableRenderOptimization?: boolean;
  getEditorContainerWidth: GetEditorContainerWidth;
  getEditorFeatureFlags: GetEditorFeatureFlags;
  hasIntlContext: boolean;
  pluginInjectionApi?: PluginInjectionAPI;
}
