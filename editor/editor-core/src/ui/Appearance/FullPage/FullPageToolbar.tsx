/** @jsx jsx */
import type { ReactElement } from 'react';
import React, { useState, useEffect } from 'react';
import { jsx } from '@emotion/react';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

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
import type {
  EditorAppearance,
  ToolbarUIComponentFactory,
  PrimaryToolbarComponents,
} from '../../../types';
import type { CollabEditOptions } from '@atlaskit/editor-common/collab';
import type { DispatchAnalyticsEvent } from '../../../plugins/analytics';
import type { EventDispatcher } from '../../../event-dispatcher';
import type { EditorActions } from '../../..';
import { ContextPanelConsumer } from '@atlaskit/editor-common/ui';
import type { FeatureFlags } from '../../../types/feature-flags';
import { fullPageMessages as messages } from '@atlaskit/editor-common/messages';
import { ToolbarArrowKeyNavigationProvider } from '@atlaskit/editor-common/ui-menu';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

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

export const EditorToolbar = React.memo(
  (props: FullPageToolbarProps & WrappedComponentProps) => {
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
        {getBooleanFF(
          'platform.confluence.frontend.editor.no.platform.avatar.group',
        ) ||
        (props?.featureFlags?.showAvatarGroupAsPlugin === true &&
          !props.featureFlags?.twoLineEditorToolbar) ? null : (
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
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <ContextPanelConsumer>
        {({ width: contextPanelWidth }) => (
          <ToolbarArrowKeyNavigationProvider
            editorView={props.editorView}
            childComponentSelector={"[data-testid='ak-editor-main-toolbar']"}
            isShortcutToFocusToolbar={isShortcutToFocusToolbar}
            handleEscape={handleEscape}
            intl={props.intl}
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
  },
);

export const FullPageToolbar = injectIntl(EditorToolbar);
