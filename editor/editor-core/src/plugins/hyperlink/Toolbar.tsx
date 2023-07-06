import React from 'react';
import {
  FloatingToolbarHandler,
  AlignType,
  FloatingToolbarItem,
} from '../floating-toolbar/types';
import {
  stateKey,
  HyperlinkState,
  InsertState,
  EditInsertedState,
} from './pm-plugins/main';
import {
  removeLink,
  editInsertedLink,
  updateLink,
  insertLinkWithAnalytics,
} from './commands';
import HyperlinkAddToolbar from './ui/HyperlinkAddToolbar';
import { EditorView } from 'prosemirror-view';
import { Mark } from 'prosemirror-model';
import { commandWithMetadata } from '@atlaskit/editor-common/card';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import CogIcon from '@atlaskit/icon/glyph/editor/settings';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';
import { normalizeUrl } from '@atlaskit/editor-common/utils';
import { EditorState } from 'prosemirror-state';
import {
  linkToolbarMessages as linkToolbarCommonMessages,
  linkMessages,
} from '../../messages';
import { isSafeUrl, LinkAttributes } from '@atlaskit/adf-schema';
import {
  LINKPICKER_HEIGHT_IN_PX,
  RECENT_SEARCH_HEIGHT_IN_PX,
  RECENT_SEARCH_WIDTH_IN_PX,
} from '@atlaskit/editor-common/ui';
import {
  Command,
  CommandDispatch,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import {
  ACTION_SUBJECT_ID,
  AnalyticsEventPayload,
  ACTION,
  INPUT_METHOD,
  buildVisitedLinkPayload,
  buildOpenedSettingsPayload,
  LinkType,
} from '@atlaskit/editor-common/analytics';
import type { HyperlinkPluginOptions } from '@atlaskit/editor-common/types';
import { IntlShape } from 'react-intl-next';
import { FeatureFlags } from '@atlaskit/editor-common/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type hyperlinkPlugin from './index';
import { toolbarKey } from './pm-plugins/toolbar-buttons';

/* type guard for edit links */
function isEditLink(
  linkMark: EditInsertedState | InsertState,
): linkMark is EditInsertedState {
  return (linkMark as EditInsertedState).pos !== undefined;
}

const dispatchAnalytics = (
  dispatch: CommandDispatch | undefined,
  state: EditorState,
  analyticsBuilder: (type: LinkType) => AnalyticsEventPayload<void>,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
) => {
  if (dispatch) {
    const { tr } = state;
    editorAnalyticsApi?.attachAnalyticsEvent(
      analyticsBuilder(ACTION_SUBJECT_ID.HYPERLINK),
    )(tr);
    dispatch(tr);
  }
};

const visitHyperlink =
  (editorAnalyticsApi: EditorAnalyticsAPI | undefined): Command =>
  (state, dispatch) => {
    dispatchAnalytics(
      dispatch,
      state,
      buildVisitedLinkPayload,
      editorAnalyticsApi,
    );
    return true;
  };

const openLinkSettings =
  (editorAnalyticsApi: EditorAnalyticsAPI | undefined): Command =>
  (state, dispatch) => {
    dispatchAnalytics(
      dispatch,
      state,
      buildOpenedSettingsPayload,
      editorAnalyticsApi,
    );
    return true;
  };

function getLinkText(
  activeLinkMark: EditInsertedState,
  state: EditorState,
): string | undefined | null {
  if (!activeLinkMark.node) {
    return undefined;
  }

  const textToUrl = normalizeUrl(activeLinkMark.node.text);
  const linkMark = activeLinkMark.node.marks.find(
    (mark: Mark) => mark.type === state.schema.marks.link,
  );
  const linkHref = linkMark && linkMark.attrs.href;

  if (textToUrl === linkHref) {
    return undefined;
  }
  return activeLinkMark.node.text;
}

const getSettingsButtonGroup = (
  state: EditorState,
  intl: IntlShape,
  featureFlags: FeatureFlags,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): FloatingToolbarItem<Command>[] => {
  const { floatingToolbarLinkSettingsButton } = featureFlags;
  return floatingToolbarLinkSettingsButton === 'true'
    ? [
        { type: 'separator' },
        {
          id: 'editor.link.settings',
          type: 'button',
          icon: CogIcon,
          title: intl.formatMessage(linkToolbarCommonMessages.settingsLink),
          onClick: openLinkSettings(editorAnalyticsApi),
          href: 'https://id.atlassian.com/manage-profile/link-preferences',
          target: '_blank',
        },
      ]
    : [];
};

export const getToolbarConfig =
  (
    options: HyperlinkPluginOptions,
    featureFlags: FeatureFlags,
    pluginInjectionApi: ExtractInjectionAPI<typeof hyperlinkPlugin> | undefined,
  ): FloatingToolbarHandler =>
  (state, intl, providerFactory) => {
    const { formatMessage } = intl;
    const linkState: HyperlinkState | undefined = stateKey.getState(state);
    const editorAnalyticsApi =
      pluginInjectionApi?.dependencies.analytics?.actions;

    /**
     * Enable focus trap only if feature flag is enabled AND for the new version of the picker
     */
    const { lpLinkPicker, lpLinkPickerFocusTrap, preventPopupOverflow } =
      featureFlags;
    const shouldEnableFocusTrap = Boolean(
      lpLinkPicker && lpLinkPickerFocusTrap,
    );

    if (linkState && linkState.activeLinkMark) {
      const { activeLinkMark } = linkState;

      const hyperLinkToolbar = {
        title: 'Hyperlink floating controls',
        nodeType: [
          state.schema.nodes.text,
          state.schema.nodes.paragraph,
          state.schema.nodes.heading,
          state.schema.nodes.taskItem,
          state.schema.nodes.decisionItem,
          state.schema.nodes.caption,
        ].filter((nodeType) => !!nodeType), // Use only the node types existing in the schema ED-6745
        align: 'left' as AlignType,
        className: activeLinkMark.type.match('INSERT|EDIT_INSERTED')
          ? 'hyperlink-floating-toolbar'
          : '',
      };
      switch (activeLinkMark.type) {
        case 'EDIT': {
          const { pos, node } = activeLinkMark;
          const linkMark = node.marks.filter(
            (mark) => mark.type === state.schema.marks.link,
          );
          const link =
            linkMark[0] && (linkMark[0].attrs as LinkAttributes).href;
          const isValidUrl = isSafeUrl(link);
          const labelOpenLink = formatMessage(
            isValidUrl
              ? linkMessages.openLink
              : linkToolbarCommonMessages.unableToOpenLink,
          );
          // TODO: ED-14403 investigate why these are not translating?
          const labelUnlink = formatMessage(linkToolbarCommonMessages.unlink);
          const editLink = formatMessage(linkToolbarCommonMessages.editLink);
          let metadata = {
            url: link,
            title: '',
          };
          if (activeLinkMark.node.text) {
            metadata.title = activeLinkMark.node.text;
          }

          return {
            ...hyperLinkToolbar,
            height: 32,
            width: 250,
            items: [
              ...(toolbarKey
                .getState(state)
                ?.items(state, intl, providerFactory, link) ?? []),
              {
                id: 'editor.link.edit',
                type: 'button',
                onClick: editInsertedLink(),
                selected: false,
                title: editLink,
                showTitle: true,
                metadata: metadata,
              },
              {
                type: 'separator',
              },
              {
                id: 'editor.link.openLink',
                type: 'button',
                disabled: !isValidUrl,
                target: '_blank',
                href: isValidUrl ? link : undefined,
                onClick: visitHyperlink(editorAnalyticsApi),
                selected: false,
                title: labelOpenLink,
                icon: OpenIcon,
                className: 'hyperlink-open-link',
                metadata: metadata,
                tabIndex: null,
              },
              {
                type: 'separator',
              },
              {
                id: 'editor.link.unlink',
                type: 'button',
                onClick: commandWithMetadata(removeLink(pos), {
                  inputMethod: INPUT_METHOD.FLOATING_TB,
                }),
                selected: false,
                title: labelUnlink,
                icon: UnlinkIcon,
                tabIndex: null,
              },
              {
                type: 'copy-button',
                items: [
                  { type: 'separator' },
                  {
                    state,
                    formatMessage: formatMessage,
                    markType: state.schema.marks.link,
                  },
                ],
              },
              ...getSettingsButtonGroup(
                state,
                intl,
                featureFlags,
                editorAnalyticsApi,
              ),
            ],
            scrollable: true,
          };
        }

        case 'EDIT_INSERTED':
        case 'INSERT': {
          let link: string;

          if (isEditLink(activeLinkMark) && activeLinkMark.node) {
            const linkMark = activeLinkMark.node.marks.filter(
              (mark: Mark) => mark.type === state.schema.marks.link,
            );
            link = linkMark[0] && linkMark[0].attrs.href;
          }
          const displayText = isEditLink(activeLinkMark)
            ? getLinkText(activeLinkMark, state)
            : linkState.activeText;

          const popupHeight = lpLinkPicker
            ? LINKPICKER_HEIGHT_IN_PX
            : RECENT_SEARCH_HEIGHT_IN_PX;

          return {
            ...hyperLinkToolbar,
            preventPopupOverflow,
            height: popupHeight,
            width: RECENT_SEARCH_WIDTH_IN_PX,
            focusTrap: shouldEnableFocusTrap,
            items: [
              {
                type: 'custom',
                fallback: [],
                disableArrowNavigation: true,
                render: (
                  view?: EditorView,
                  idx?: number,
                ): React.ReactElement | null => {
                  if (!view) {
                    return null;
                  }
                  return (
                    <HyperlinkAddToolbar
                      view={view}
                      key={idx}
                      linkPickerOptions={options?.linkPicker}
                      featureFlags={featureFlags}
                      displayUrl={link}
                      displayText={displayText || ''}
                      providerFactory={providerFactory}
                      onCancel={() => view.focus()}
                      onClose={
                        lpLinkPickerFocusTrap ? () => view.focus() : undefined
                      }
                      onSubmit={(
                        href,
                        title = '',
                        displayText,
                        inputMethod,
                        analytic,
                      ) => {
                        const isEdit = isEditLink(activeLinkMark);
                        const action = isEdit
                          ? ACTION.UPDATED
                          : ACTION.INSERTED;

                        const command = isEdit
                          ? commandWithMetadata(
                              updateLink(
                                href,
                                displayText || title,
                                activeLinkMark.pos,
                              ),
                              {
                                action,
                                sourceEvent: analytic,
                              },
                            )
                          : insertLinkWithAnalytics(
                              inputMethod,
                              activeLinkMark.from,
                              activeLinkMark.to,
                              href,
                              title,
                              displayText,
                              !!options?.cardOptions?.provider,
                              analytic,
                            );

                        command(view.state, view.dispatch, view);

                        if (!lpLinkPickerFocusTrap) {
                          view.focus();
                        }
                      }}
                    />
                  );
                },
              },
            ],
          };
        }
      }
    }
    return;
  };
