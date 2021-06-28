import React, { ReactElement } from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import { EditorView } from 'prosemirror-view';

import AvatarsWithPluginState from '../../../plugins/collab-edit/ui';
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
import { DispatchAnalyticsEvent } from '../../../plugins/analytics';
import { EventDispatcher } from '../../../event-dispatcher';
import { EditorActions } from '../../..';
import { ContextPanelConsumer } from '../../ContextPanel/context';
import { FeatureFlags } from '../../../types/feature-flags';

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
  hasMinWidth?: boolean;
  featureFlags?: FeatureFlags;
}

export const FullPageToolbar: React.FunctionComponent<FullPageToolbarProps> = React.memo(
  (props) => {
    return (
      <ContextPanelConsumer>
        {({ width: contextPanelWidth }) => (
          <MainToolbar
            data-testid="ak-editor-main-toolbar"
            showKeyline={props.showKeyline || contextPanelWidth > 0}
          >
            {props.beforeIcon && (
              <MainToolbarIconBefore>{props.beforeIcon}</MainToolbarIconBefore>
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
              hasMinWidth={props.hasMinWidth}
            />
            <MainToolbarCustomComponentsSlot
              data-testid={'avatar-group-outside-plugin'}
            >
              {props?.featureFlags?.showAvatarGroupAsPlugin === true ? null : (
                <AvatarsWithPluginState
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
              )}
              {props.customPrimaryToolbarComponents}
            </MainToolbarCustomComponentsSlot>
          </MainToolbar>
        )}
      </ContextPanelConsumer>
    );
  },
);
