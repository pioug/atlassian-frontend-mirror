import { EditorView } from 'prosemirror-view';
import { RefObject } from 'react';
import { ProviderFactory, ExtensionHandlers } from '@atlaskit/editor-common';
import { EventDispatcher } from '../event-dispatcher';
import EditorActions from '../actions';
import { UIComponentFactory } from '../types/ui-components';
import { ReactComponents } from '../types/editor-props';
import { ToolbarUIComponentFactory } from '../ui/Toolbar/types';
import { CollabEditOptions } from '../plugins/collab-edit/types';
import { DispatchAnalyticsEvent } from '../plugins/analytics';
import { EditorAppearance } from './editor-appearance';
import { MenuItem } from '../ui/DropdownMenu/types';
import { ReactElement } from 'react';
import { FeatureFlags } from './feature-flags';

export interface EditorAppearanceComponentProps {
  appearance?: EditorAppearance;
  onSave?: (editorView: EditorView) => void;
  onCancel?: (editorView: EditorView) => void;

  providerFactory: ProviderFactory;
  editorActions?: EditorActions;
  editorDOMElement: JSX.Element;
  editorView?: EditorView;

  eventDispatcher?: EventDispatcher;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;

  maxHeight?: number;

  contentComponents?: UIComponentFactory[];
  primaryToolbarComponents?: ToolbarUIComponentFactory[];
  primaryToolbarIconBefore?: ReactElement;
  secondaryToolbarComponents?: UIComponentFactory[];

  customContentComponents?: ReactComponents;
  customPrimaryToolbarComponents?: ReactComponents;
  customSecondaryToolbarComponents?: ReactComponents;
  insertMenuItems?: MenuItem[];
  contextPanel?: ReactComponents;

  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;

  extensionHandlers?: ExtensionHandlers;

  disabled?: boolean;

  collabEdit?: CollabEditOptions;

  allowDynamicTextSizing?: boolean;
  allowAnnotation?: boolean;
  persistScrollGutter?: boolean;

  enableToolbarMinWidth?: boolean;

  featureFlags?: FeatureFlags;
  useStickyToolbar?: boolean | RefObject<HTMLElement>;
}
