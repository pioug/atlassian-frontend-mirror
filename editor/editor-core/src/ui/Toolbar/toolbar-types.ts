import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { EditorAppearance } from '../../types/editor-appearance';
import { ToolbarSize, ToolbarUIComponentFactory } from './types';
import { EventDispatcher } from '../../event-dispatcher';
import EditorActions from '../../actions';
import { DispatchAnalyticsEvent } from '../../plugins/analytics';

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
}

export type ToolbarWithSizeDetectorProps = Omit<ToolbarProps, 'toolbarSize'>;

export interface ToolbarInnerProps extends ToolbarProps {
  isToolbarReducedSpacing: boolean;
  isReducedSpacing?: boolean;
}

export const toolbarTestIdPrefix = 'ak-editor-toolbar-button';
