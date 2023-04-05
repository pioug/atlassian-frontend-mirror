/** @jsx jsx */
import React, { ReactElement, useState, useEffect } from 'react';
import { jsx } from '@emotion/react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { EditorView } from 'prosemirror-view';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';

import AvatarsWithPluginState from '../../../plugins/collab-edit/ui';
import FindReplaceToolbarButtonWithState from '../../../plugins/find-replace/FindReplaceToolbarButtonWithState';
import { BeforePrimaryToolbarWrapper } from '../../../plugins/before-primaryToolbar/ui/BeforePrimaryToolbarWrapper';
import Toolbar from '../../Toolbar';
import {
  mainToolbarStyle,
  mainToolbarIconBeforeStyle,
  mainToolbarFirstChildStyle,
  mainToolbarSecondChildStyle,
  nonCustomToolbarWrapperStyle,
  customToolbarWrapperStyle,
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
import { ToolbarArrowKeyNavigationProvider } from '../../ToolbarArrowKeyNavigationProvider';

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
    <div css={nonCustomToolbarWrapperStyle}>
      {props.beforeIcon && (
        <div css={mainToolbarIconBeforeStyle}>{props.beforeIcon}</div>
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
        twoLineEditorToolbar={!!props.featureFlags?.twoLineEditorToolbar}
      />
    </div>
  );

  const customToolbar = (
    <div css={customToolbarWrapperStyle}>
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
          featureFlags={props.featureFlags || {}}
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
          featureFlags={props.featureFlags}
        />
      ) : null}
      {!!props.customPrimaryToolbarComponents &&
      'after' in props.customPrimaryToolbarComponents
        ? props.customPrimaryToolbarComponents.after
        : props.customPrimaryToolbarComponents}
    </div>
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

  const isShortcutToFocusToolbar = (event: KeyboardEvent) => {
    //Alt + F9 to reach first element in this main toolbar
    return event.altKey && (event.key === 'F9' || event.keyCode === 120);
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (!props.editorView?.hasFocus()) {
      props.editorView?.focus();
    }
  };

  return (
    <ContextPanelConsumer>
      {({ width: contextPanelWidth }) => (
        <ToolbarArrowKeyNavigationProvider
          editorView={props.editorView}
          childComponentSelector={"[data-testid='ak-editor-main-toolbar']"}
          isShortcutToFocusToolbar={isShortcutToFocusToolbar}
          handleEscape={handleEscape}
        >
          <div
            css={mainToolbarStyle(
              props.showKeyline || contextPanelWidth > 0,
              !!props.featureFlags?.twoLineEditorToolbar,
            )}
            data-testid="ak-editor-main-toolbar"
          >
            <div
              css={mainToolbarFirstChildStyle(
                !!props.featureFlags?.twoLineEditorToolbar,
              )}
              role="toolbar"
              aria-label={props.intl.formatMessage(messages.toolbarLabel)}
            >
              {shouldSplitToolbar ? customToolbar : nonCustomToolbar}
            </div>
            <div
              css={mainToolbarSecondChildStyle(
                !!props.featureFlags?.twoLineEditorToolbar,
              )}
              data-testid={'avatar-group-outside-plugin'}
              role="region"
              aria-label={props.intl.formatMessage(messages.pageActionsLabel)}
            >
              {shouldSplitToolbar ? nonCustomToolbar : customToolbar}
            </div>
          </div>
        </ToolbarArrowKeyNavigationProvider>
      )}
    </ContextPanelConsumer>
  );
});

export const FullPageToolbar = injectIntl(EditorToolbar);
