import React from 'react';

import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import {
  DatasourceAdf,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import { withOuterListeners } from '@atlaskit/editor-common/ui';
import { commandWithMetadata } from '@atlaskit/editor-common/card';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import type {
  LinkInputType,
  LinkPickerOptions,
} from '@atlaskit/editor-common/types';
import {
  HyperlinkAddToolbar as HyperlinkToolbar,
  HyperlinkAddToolbarProps,
} from '@atlaskit/editor-common/link';
import {
  showLinkToolbar,
  hideLinkToolbar,
  showDatasourceModal,
} from '../pm-plugins/actions';

import type {
  Command,
  FloatingToolbarItem,
  FloatingToolbarConfig,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';

import {
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
  ACTION,
  EditorAnalyticsAPI,
  buildEditLinkPayload,
} from '@atlaskit/editor-common/analytics';

import {
  LINKPICKER_HEIGHT_IN_PX,
  RECENT_SEARCH_HEIGHT_IN_PX,
  RECENT_SEARCH_WIDTH_IN_PX,
} from '@atlaskit/editor-common/ui';

import { changeSelectedCardToLink, updateCard } from '../pm-plugins/doc';
import { findCardInfo, displayInfoForCard } from '../utils';
import { NodeSelection } from 'prosemirror-state';
import { linkToolbarMessages } from '@atlaskit/editor-common/messages';
import { FeatureFlags } from '@atlaskit/editor-common/types';
import type cardPlugin from '../index';
import type { ForceFocusSelector } from '@atlaskit/editor-plugin-floating-toolbar';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '@atlaskit/link-datasource';

export type EditLinkToolbarProps = {
  view: EditorView;
  providerFactory: ProviderFactory;
  url: string | undefined;
  text: string;
  node: Node;
  onSubmit?: (
    href: string,
    text?: string,
    inputMethod?: LinkInputType,
    analytic?: UIAnalyticsEvent | null | undefined,
  ) => void;
  linkPickerOptions?: LinkPickerOptions;
  featureFlags: FeatureFlags;
  forceFocusSelector: ForceFocusSelector | undefined;
  pluginInjectionApi: any;
};
const HyperLinkToolbarWithListeners = withOuterListeners(
  HyperlinkAddToolbarWithState,
);

export function HyperlinkAddToolbarWithState({
  linkPickerOptions = {},
  onSubmit,
  displayText,
  displayUrl,
  providerFactory,
  view,
  onCancel,
  invokeMethod,
  featureFlags,
  onClose,
  onEscapeCallback,
  onClickAwayCallback,
  pluginInjectionApi,
}: HyperlinkAddToolbarProps & { pluginInjectionApi: any }) {
  const { hyperlinkState } = useSharedPluginState(pluginInjectionApi, [
    'hyperlink',
  ]);
  return (
    <HyperlinkToolbar
      linkPickerOptions={linkPickerOptions}
      onSubmit={onSubmit}
      displayText={displayText}
      displayUrl={displayUrl}
      providerFactory={providerFactory}
      view={view}
      onCancel={onCancel}
      invokeMethod={invokeMethod}
      featureFlags={featureFlags}
      onClose={onClose}
      onEscapeCallback={onEscapeCallback}
      onClickAwayCallback={onClickAwayCallback}
      hyperlinkPluginState={hyperlinkState}
    />
  );
}

export class EditLinkToolbar extends React.Component<EditLinkToolbarProps> {
  componentDidUpdate(prevProps: EditLinkToolbarProps) {
    if (prevProps.node !== this.props.node) {
      this.hideLinkToolbar();
    }
  }

  componentWillUnmount() {
    this.hideLinkToolbar();
  }

  /** Focus should move to the 'Edit link' button when the toolbar closes
   * and not close the floating toolbar.
   */
  private handleEsc = (e: KeyboardEvent) => {
    this.props.forceFocusSelector?.(
      `[aria-label="${linkToolbarMessages.editLink.defaultMessage}"]`,
      this.props.view,
    );
  };

  private hideLinkToolbar() {
    const { view } = this.props;
    view.dispatch(hideLinkToolbar(view.state.tr));
  }
  render() {
    const {
      linkPickerOptions,
      providerFactory,
      url,
      text,
      view,
      featureFlags,
      onSubmit,
      pluginInjectionApi,
    } = this.props;

    return (
      <HyperLinkToolbarWithListeners
        pluginInjectionApi={pluginInjectionApi}
        view={view}
        linkPickerOptions={linkPickerOptions}
        providerFactory={providerFactory}
        displayUrl={url}
        displayText={text}
        handleEscapeKeydown={this.handleEsc}
        // Assumes that the smart card link picker can only ever be invoked by clicking "edit"
        // via the floating toolbar
        invokeMethod={INPUT_METHOD.FLOATING_TB}
        featureFlags={featureFlags}
        onSubmit={(href, title, displayText, inputMethod, analytic) => {
          this.hideLinkToolbar();
          if (onSubmit) {
            onSubmit(href, displayText || title, inputMethod, analytic);
          }
        }}
        onEscapeCallback={(state, dispatch) => {
          const { tr } = state;
          pluginInjectionApi?.dependencies.hyperlink.actions.hideLinkToolbar(
            tr,
          );
          hideLinkToolbar(tr);

          if (dispatch) {
            dispatch(tr);
            return true;
          }
          return false;
        }}
        onClickAwayCallback={(state, dispatch) => {
          const { tr } = state;
          pluginInjectionApi?.dependencies.hyperlink.actions.hideLinkToolbar(
            tr,
          );

          if (dispatch) {
            dispatch(tr);
            return true;
          }
          return false;
        }}
      />
    );
  }
}

export const editLink =
  (editorAnalyticsApi: EditorAnalyticsAPI | undefined): Command =>
  (state, dispatch) => {
    let type = 'hyperlink';
    if (state.selection instanceof NodeSelection) {
      type = state.selection.node.type.name;
    }

    if (dispatch) {
      const { tr } = state;
      showLinkToolbar(tr);
      editorAnalyticsApi?.attachAnalyticsEvent(
        buildEditLinkPayload(
          type as
            | ACTION_SUBJECT_ID.CARD_INLINE
            | ACTION_SUBJECT_ID.CARD_BLOCK
            | ACTION_SUBJECT_ID.EMBEDS,
        ),
      )(tr);
      dispatch(tr);
      return true;
    }

    return false;
  };

export const buildEditLinkToolbar = ({
  providerFactory,
  node,
  linkPicker,
  featureFlags,
  pluginInjectionApi,
}: {
  providerFactory: ProviderFactory;
  node: Node;
  linkPicker?: LinkPickerOptions;
  featureFlags: FeatureFlags;
  pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined;
}): FloatingToolbarItem<Command> => {
  return {
    type: 'custom',
    disableArrowNavigation: true,
    fallback: [],
    render: (view, idx) => {
      if (!view || !providerFactory) {
        return null;
      }

      const displayInfo = displayInfoForCard(node, findCardInfo(view.state));

      return (
        <EditLinkToolbar
          pluginInjectionApi={pluginInjectionApi}
          key={idx}
          view={view}
          linkPickerOptions={linkPicker}
          providerFactory={providerFactory}
          url={displayInfo.url}
          text={displayInfo.title || ''}
          node={node}
          featureFlags={featureFlags}
          forceFocusSelector={
            pluginInjectionApi?.dependencies.floatingToolbar.actions
              ?.forceFocusSelector
          }
          onSubmit={(newHref, newText, inputMethod, analytic) => {
            const urlChanged = newHref !== displayInfo.url;
            const titleChanged = newText !== displayInfo.title;

            // If the title is changed in a smartlink, convert to standard blue hyperlink
            // (even if the url was also changed) - we don't want to lose the custom title.
            if (titleChanged) {
              return commandWithMetadata(
                changeSelectedCardToLink(
                  newText,
                  newHref,
                  undefined,
                  undefined,
                  undefined,
                  pluginInjectionApi?.dependencies.analytics?.actions,
                ),
                {
                  action: ACTION.UPDATED,
                  inputMethod,
                  sourceEvent: analytic,
                },
              )(view.state, view.dispatch);
            }

            if (urlChanged) {
              // If *only* the url is changed in a smart link, reresolve
              return updateCard(newHref, analytic)(view.state, view.dispatch);
            }
          }}
        />
      );
    },
  };
};

export const editLinkToolbarConfig = (
  showLinkingToolbar: boolean,
  lpLinkPicker: boolean,
): Partial<FloatingToolbarConfig> => {
  return showLinkingToolbar
    ? {
        height: lpLinkPicker
          ? LINKPICKER_HEIGHT_IN_PX
          : RECENT_SEARCH_HEIGHT_IN_PX,
        width: RECENT_SEARCH_WIDTH_IN_PX,
        forcePlacement: true,
      }
    : {};
};

export const editDatasource =
  (node: Node, editorAnalyticsApi: EditorAnalyticsAPI | undefined): Command =>
  (state, dispatch) => {
    const modalType =
      (node.attrs as DatasourceAdf['attrs'])?.datasource.id ===
      JIRA_LIST_OF_LINKS_DATASOURCE_ID
        ? 'jira'
        : undefined;

    if (dispatch && modalType) {
      const { tr } = state;
      showDatasourceModal(modalType)(tr);
      // editorAnalyticsApi?.attachAnalyticsEvent(
      //   buildEditLinkPayload(
      //     type as
      //       | ACTION_SUBJECT_ID.CARD_INLINE
      //       | ACTION_SUBJECT_ID.CARD_BLOCK
      //       | ACTION_SUBJECT_ID.EMBEDS,
      //   ),
      // )(tr);
      dispatch(tr);
      return true;
    }
    return false;
  };
