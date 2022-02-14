import React, { ReactElement, useState, useEffect } from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { EditorView } from 'prosemirror-view';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';

import AvatarsWithPluginState from '../../../plugins/collab-edit/ui';
import FindReplaceToolbarButtonWithState from '../../../plugins/find-replace/FindReplaceToolbarButtonWithState';
import { BeforePrimaryToolbarWrapper } from '../../../plugins/before-primaryToolbar/ui/BeforePrimaryToolbarWrapper';
import Toolbar from '../../Toolbar';
import {
  MainToolbar,
  MainToolbarIconBefore,
  MainToolbarFirstChild,
  MainToolbarSecondChild,
  NonCustomToolbarWrapper,
  CustomToolbarWrapper,
  MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT,
} from './MainToolbar';
import {
  EditorAppearance,
  ToolbarUIComponentFactory,
  PrimaryToolbarComponents,
} from '../../../types';
import { CollabEditOptions } from '../../../plugins/collab-edit';
import { DispatchAnalyticsEvent } from '../../../plugins/analytics';
import { EventDispatcher } from '../../../event-dispatcher';
import { EditorActions } from '../../..';
import { ContextPanelConsumer } from '../../ContextPanel/context';
import { FeatureFlags } from '../../../types/feature-flags';
import messages from './messages';

export interface FullPageToolbarProps {
  appearance?: EditorAppearance;
  providerFactory: ProviderFactory;
  editorActions?: EditorActions;
  editorDOMElement: JSX.Element;
  editorView: EditorView;
  eventDispatcher: EventDispatcher;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  primaryToolbarComponents?: ToolbarUIComponentFactory[];
  customPrimaryToolbarComponents?: PrimaryToolbarComponents;
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

export const EditorToolbar: React.FunctionComponent<
  FullPageToolbarProps & WrappedComponentProps
> = React.memo((props) => {
  const [shouldSplitToolbar, setShouldSplitToolbar] = useState(false);

  const nonCustomToolbar = (
    <NonCustomToolbarWrapper>
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
    </NonCustomToolbarWrapper>
  );

  const customToolbar = (
    <CustomToolbarWrapper>
      {props.featureFlags?.twoLineEditorToolbar &&
      !!props.customPrimaryToolbarComponents &&
      'before' in props.customPrimaryToolbarComponents ? (
        <BeforePrimaryToolbarWrapper
          beforePrimaryToolbarComponents={
            props.customPrimaryToolbarComponents.before
          }
        />
      ) : null}
      {props?.featureFlags?.showAvatarGroupAsPlugin === true &&
      !props.featureFlags?.twoLineEditorToolbar ? null : (
        <AvatarsWithPluginState
          editorView={props.editorView}
          eventDispatcher={props.eventDispatcher}
          inviteToEditComponent={props.collabEdit?.inviteToEditComponent}
          inviteToEditHandler={props.collabEdit?.inviteToEditHandler}
          isInviteToEditButtonSelected={
            props.collabEdit?.isInviteToEditButtonSelected
          }
        />
      )}
      {props.featureFlags?.findReplace &&
      props.featureFlags?.twoLineEditorToolbar ? (
        <FindReplaceToolbarButtonWithState
          popupsBoundariesElement={props.popupsBoundariesElement}
          popupsMountPoint={props.popupsMountPoint}
          popupsScrollableElement={props.popupsScrollableElement}
          editorView={props.editorView}
          containerElement={props.containerElement}
          dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
        />
      ) : null}
      {!!props.customPrimaryToolbarComponents &&
      'after' in props.customPrimaryToolbarComponents
        ? props.customPrimaryToolbarComponents.after
        : props.customPrimaryToolbarComponents}
    </CustomToolbarWrapper>
  );

  useEffect(() => {
    if (props.featureFlags?.twoLineEditorToolbar) {
      const updateOnResize = () => {
        setShouldSplitToolbar(
          window.innerWidth <= MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT,
        );
      };
      window.addEventListener('resize', updateOnResize);
      updateOnResize();
      return () => window.removeEventListener('resize', updateOnResize);
    }
  });
  return (
    <ContextPanelConsumer>
      {({ width: contextPanelWidth }) => (
        <MainToolbar
          data-testid="ak-editor-main-toolbar"
          showKeyline={props.showKeyline || contextPanelWidth > 0}
          twoLineEditorToolbar={!!props.featureFlags?.twoLineEditorToolbar}
        >
          <MainToolbarFirstChild
            twoLineEditorToolbar={!!props.featureFlags?.twoLineEditorToolbar}
            role="region"
            aria-label={props.intl.formatMessage(messages.toolbarLabel)}
          >
            {shouldSplitToolbar ? customToolbar : nonCustomToolbar}
          </MainToolbarFirstChild>
          <MainToolbarSecondChild
            data-testid={'avatar-group-outside-plugin'}
            twoLineEditorToolbar={!!props.featureFlags?.twoLineEditorToolbar}
            role="region"
            aria-label={props.intl.formatMessage(messages.pageActionsLabel)}
          >
            {shouldSplitToolbar ? nonCustomToolbar : customToolbar}
          </MainToolbarSecondChild>
        </MainToolbar>
      )}
    </ContextPanelConsumer>
  );
});

export const FullPageToolbar = injectIntl(EditorToolbar);
