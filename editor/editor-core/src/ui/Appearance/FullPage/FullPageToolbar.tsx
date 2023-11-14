/** @jsx jsx */
import type { ReactElement } from 'react';
import React, { useState, useEffect } from 'react';
import { jsx } from '@emotion/react';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

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
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { EditorActions } from '../../..';
import { ContextPanelConsumer } from '@atlaskit/editor-common/ui';
import type { FeatureFlags } from '../../../types/feature-flags';
import { fullPageMessages as messages } from '@atlaskit/editor-common/messages';
import { ToolbarArrowKeyNavigationProvider } from '@atlaskit/editor-common/ui-menu';
import { usePresetContext } from '../../../presets/context';
import type { FindReplacePlugin } from './../../../plugins/find-replace';

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
  featureFlags: FeatureFlags;
  hideAvatarGroup?: boolean;
}

export const EditorToolbar = React.memo(
  (props: FullPageToolbarProps & WrappedComponentProps) => {
    const [shouldSplitToolbar, setShouldSplitToolbar] = useState(false);
    const editorAPI =
      usePresetContext<
        [OptionalPlugin<AnalyticsPlugin>, OptionalPlugin<FindReplacePlugin>]
      >();

    // When primary toolbar components is undefined, do not show two line editor toolbar
    const twoLineEditorToolbar =
      !!props.customPrimaryToolbarComponents &&
      !!props.featureFlags?.twoLineEditorToolbar;

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
          twoLineEditorToolbar={twoLineEditorToolbar}
        />
      </div>
    );

    const customToolbar = (
      <div css={customToolbarWrapperStyle}>
        {twoLineEditorToolbar &&
        !!props.customPrimaryToolbarComponents &&
        'before' in props.customPrimaryToolbarComponents ? (
          <BeforePrimaryToolbarWrapper
            beforePrimaryToolbarComponents={
              props.customPrimaryToolbarComponents.before
            }
          />
        ) : null}
        {props.hideAvatarGroup ||
        (props?.featureFlags?.showAvatarGroupAsPlugin === true &&
          !props.featureFlags?.twoLineEditorToolbar) ? null : (
          // Avatars are moved to Confluence codebase for Edit in Context
          // When Edit in Context is enabled customPrimaryToolbarComponents is undefined
          // For more details please check
          // https://hello.atlassian.net/wiki/spaces/PCG/pages/2851572180/Editor+toolbar+for+live+pages+and+edit+in+context+projects
          <AvatarsWithPluginState
            editorView={props.editorView}
            eventDispatcher={props.eventDispatcher}
            inviteToEditComponent={props.collabEdit?.inviteToEditComponent}
            inviteToEditHandler={props.collabEdit?.inviteToEditHandler}
            isInviteToEditButtonSelected={
              props.collabEdit?.isInviteToEditButtonSelected
            }
            featureFlags={props.featureFlags || {}}
            editorAnalyticsAPI={editorAPI?.analytics?.actions}
          />
        )}
        {editorAPI?.findReplace && twoLineEditorToolbar ? (
          <FindReplaceToolbarButtonWithState
            popupsBoundariesElement={props.popupsBoundariesElement}
            popupsMountPoint={props.popupsMountPoint}
            popupsScrollableElement={props.popupsScrollableElement}
            editorView={props.editorView}
            containerElement={props.containerElement}
            dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
            featureFlags={props.featureFlags}
            editorAnalyticsAPI={editorAPI?.analytics?.actions}
          />
        ) : null}
        {!!props.customPrimaryToolbarComponents &&
        'after' in props.customPrimaryToolbarComponents
          ? props.customPrimaryToolbarComponents.after
          : props.customPrimaryToolbarComponents}
      </div>
    );

    useEffect(() => {
      if (twoLineEditorToolbar) {
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
                twoLineEditorToolbar,
              )}
              data-testid="ak-editor-main-toolbar"
            >
              <div
                css={mainToolbarFirstChildStyle(twoLineEditorToolbar)}
                role="toolbar"
                aria-label={props.intl.formatMessage(messages.toolbarLabel)}
              >
                {shouldSplitToolbar ? customToolbar : nonCustomToolbar}
              </div>
              <div
                css={mainToolbarSecondChildStyle(twoLineEditorToolbar)}
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
