import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EditorAppearance } from '../../types/editor-appearance';
import type { ToolbarSize, ToolbarUIComponentFactory } from './types';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type EditorActions from '../../actions';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';

export interface ToolbarBreakPoint {
  width: number;
  size: ToolbarSize;
}

export interface ToolbarProps {
  items?: Array<ToolbarUIComponentFactory>;
  editorView: EditorView;
  editorActions?: EditorActions;
  eventDispatcher: EventDispatcher;
  providerFactory: ProviderFactory;
  appearance?: EditorAppearance;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  disabled: boolean;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  toolbarSize: ToolbarSize;
  containerElement: HTMLElement | null;
  hasMinWidth?: boolean;
  twoLineEditorToolbar?: boolean;
}

export type ToolbarWithSizeDetectorProps = Omit<ToolbarProps, 'toolbarSize'>;

export interface ToolbarInnerProps extends ToolbarProps {
  isToolbarReducedSpacing: boolean;
  isReducedSpacing?: boolean;
}

export const toolbarTestIdPrefix = 'ak-editor-toolbar-button';
