import { RefObject } from 'react';
import { ReactElement } from 'react';

import { EditorView } from 'prosemirror-view';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ReactHookFactory } from '@atlaskit/editor-common/types';

import EditorActions from '../actions';
import { EventDispatcher } from '../event-dispatcher';
import { CollabEditOptions } from '../plugins/collab-edit/types';
import {
  PrimaryToolbarComponents,
  ReactComponents,
  UseStickyToolbarType,
} from '../types/editor-props';
import { UIComponentFactory } from '../types/ui-components';
import { MenuItem } from '../ui/DropdownMenu/types';
import { ToolbarUIComponentFactory } from '../ui/Toolbar/types';

import { EditorAppearance } from './editor-appearance';
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
  minHeight?: number;

  contentComponents?: UIComponentFactory[];
  pluginHooks?: ReactHookFactory[];
  primaryToolbarComponents?: ToolbarUIComponentFactory[];
  primaryToolbarIconBefore?: ReactElement;
  secondaryToolbarComponents?: UIComponentFactory[];

  customContentComponents?: ReactComponents;
  customPrimaryToolbarComponents?: PrimaryToolbarComponents;
  customSecondaryToolbarComponents?: ReactComponents;
  insertMenuItems?: MenuItem[];
  contextPanel?: ReactComponents;

  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;

  extensionHandlers?: ExtensionHandlers;

  disabled?: boolean;

  collabEdit?: CollabEditOptions;

  persistScrollGutter?: boolean;

  enableToolbarMinWidth?: boolean;

  featureFlags: FeatureFlags;
  useStickyToolbar?: UseStickyToolbarType;

  innerRef?: RefObject<HTMLDivElement>;
}
