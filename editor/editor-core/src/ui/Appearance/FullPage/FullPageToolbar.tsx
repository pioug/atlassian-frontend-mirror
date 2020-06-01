import React, { ReactElement } from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import { EditorView } from 'prosemirror-view';

import WithPluginState from '../../WithPluginState';
import Avatars from '../../../plugins/collab-edit/ui/avatars';
import Toolbar from '../../Toolbar';
import {
  MainToolbar,
  MainToolbarIconBefore,
  MainToolbarCustomComponentsSlot,
} from './MainToolbar';
import {
  EditorAppearance,
  ReactComponents,
  ToolbarUIComponentFactory,
} from '../../../types';
import { CollabEditOptions } from '../../../plugins/collab-edit';
import { pluginKey as contextPanelPluginKey } from '../../../plugins/context-panel';
import { DispatchAnalyticsEvent } from '../../../plugins/analytics';
import { EventDispatcher } from '../../../event-dispatcher';
import { EditorActions } from '../../..';

export interface FullPageToolbarProps {
  appearance?: EditorAppearance;
  providerFactory: ProviderFactory;
  editorActions?: EditorActions;
  editorDOMElement: JSX.Element;
  editorView: EditorView;
  eventDispatcher: EventDispatcher;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  primaryToolbarComponents?: ToolbarUIComponentFactory[];
  customPrimaryToolbarComponents?: ReactComponents;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  disabled: boolean;
  collabEdit?: CollabEditOptions;
  showKeyline: boolean;
  containerElement: HTMLElement | null;
  beforeIcon?: ReactElement;
}

export const FullPageToolbar: React.FunctionComponent<FullPageToolbarProps> = React.memo(
  props => {
    return (
      <WithPluginState
        editorView={props.editorView}
        plugins={{
          contextPanel: contextPanelPluginKey,
        }}
        render={({ contextPanel }) => {
          return (
            <MainToolbar
              showKeyline={
                props.showKeyline || (contextPanel && contextPanel.visible)
              }
            >
              {props.beforeIcon && (
                <MainToolbarIconBefore>
                  {props.beforeIcon}
                </MainToolbarIconBefore>
              )}
              <Toolbar
                editorView={props.editorView}
                editorActions={props.editorActions}
                eventDispatcher={props.eventDispatcher}
                providerFactory={props.providerFactory}
                appearance={props.appearance}
                items={props.primaryToolbarComponents}
                popupsMountPoint={props.popupsMountPoint}
                popupsBoundariesElement={props.popupsBoundariesElement}
                popupsScrollableElement={props.popupsScrollableElement}
                disabled={props.disabled}
                dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
                containerElement={props.containerElement}
              />
              <MainToolbarCustomComponentsSlot>
                <Avatars
                  editorView={props.editorView}
                  eventDispatcher={props.eventDispatcher}
                  inviteToEditComponent={
                    props.collabEdit && props.collabEdit.inviteToEditComponent
                  }
                  inviteToEditHandler={
                    props.collabEdit && props.collabEdit.inviteToEditHandler
                  }
                  isInviteToEditButtonSelected={
                    props.collabEdit &&
                    props.collabEdit.isInviteToEditButtonSelected
                  }
                />
                {props.customPrimaryToolbarComponents}
              </MainToolbarCustomComponentsSlot>
            </MainToolbar>
          );
        }}
      />
    );
  },
);
