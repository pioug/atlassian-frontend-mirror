import React from 'react';

import type { IntlShape } from 'react-intl-next';

import type { LinkAttributes } from '@atlaskit/adf-schema';
import { isSafeUrl } from '@atlaskit/adf-schema';
import {
  ACTION,
  ACTION_SUBJECT_ID,
  buildOpenedSettingsPayload,
  buildVisitedLinkPayload,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type {
  AnalyticsEventPayload,
  EditorAnalyticsAPI,
  LinkType,
} from '@atlaskit/editor-common/analytics';
import { commandWithMetadata } from '@atlaskit/editor-common/card';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { HyperlinkAddToolbar } from '@atlaskit/editor-common/link';
import type {
  EditInsertedState,
  HyperlinkAddToolbarProps,
  HyperlinkState,
  InsertState,
} from '@atlaskit/editor-common/link';
import {
  linkMessages,
  linkToolbarMessages as linkToolbarCommonMessages,
} from '@atlaskit/editor-common/messages';
import type {
  AlignType,
  Command,
  CommandDispatch,
  ExtractInjectionAPI,
  FeatureFlags,
  FloatingToolbarHandler,
  FloatingToolbarItem,
  HyperlinkPluginOptions,
} from '@atlaskit/editor-common/types';
import {
  LINKPICKER_HEIGHT_IN_PX,
  RECENT_SEARCH_HEIGHT_IN_PX,
  RECENT_SEARCH_WIDTH_IN_PX,
} from '@atlaskit/editor-common/ui';
import { normalizeUrl } from '@atlaskit/editor-common/utils';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import CogIcon from '@atlaskit/icon/glyph/editor/settings';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';

import {
  editInsertedLink,
  insertLinkWithAnalytics,
  onClickAwayCallback,
  onEscapeCallback,
  removeLink,
  updateLink,
} from './commands';
import { stateKey } from './pm-plugins/main';
import { toolbarKey } from './pm-plugins/toolbar-buttons';

import type { hyperlinkPlugin } from './index';

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
    <HyperlinkAddToolbar
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
    const editorAnalyticsApi = pluginInjectionApi?.analytics?.actions;
    const { lpLinkPicker, preventPopupOverflow } = featureFlags;

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
        ].filter(nodeType => !!nodeType), // Use only the node types existing in the schema ED-6745
        align: 'left' as AlignType,
        className: activeLinkMark.type.match('INSERT|EDIT_INSERTED')
          ? 'hyperlink-floating-toolbar'
          : '',
      };
      switch (activeLinkMark.type) {
        case 'EDIT': {
          const { pos, node } = activeLinkMark;
          const linkMark = node.marks.filter(
            mark => mark.type === state.schema.marks.link,
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
                testId: 'editor.link.edit',
                type: 'button',
                onClick: editInsertedLink(editorAnalyticsApi),
                title: editLink,
                showTitle: true,
                metadata: metadata,
              },
              {
                type: 'separator',
              },
              {
                id: 'editor.link.openLink',
                testId: 'editor.link.openLink',
                type: 'button',
                disabled: !isValidUrl,
                target: '_blank',
                href: isValidUrl ? link : undefined,
                onClick: visitHyperlink(editorAnalyticsApi),
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
                testId: 'editor.link.unlink',
                type: 'button',
                onClick: commandWithMetadata(
                  removeLink(pos, editorAnalyticsApi),
                  {
                    inputMethod: INPUT_METHOD.FLOATING_TB,
                  },
                ),
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
                    <HyperlinkAddToolbarWithState
                      pluginInjectionApi={pluginInjectionApi}
                      view={view}
                      key={idx}
                      linkPickerOptions={options?.linkPicker}
                      featureFlags={featureFlags}
                      displayUrl={link}
                      displayText={displayText || ''}
                      providerFactory={providerFactory}
                      onCancel={() => view.focus()}
                      onEscapeCallback={onEscapeCallback}
                      onClickAwayCallback={onClickAwayCallback}
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
                                inputMethod,
                                sourceEvent: analytic,
                              },
                            )
                          : insertLinkWithAnalytics(
                              inputMethod,
                              activeLinkMark.from,
                              activeLinkMark.to,
                              href,
                              editorAnalyticsApi,
                              title,
                              displayText,
                              !!options?.cardOptions?.provider,
                              analytic,
                            );

                        command(view.state, view.dispatch, view);

                        view.focus();
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
