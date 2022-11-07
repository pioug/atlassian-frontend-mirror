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
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import CogIcon from '@atlaskit/icon/glyph/editor/settings';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';
import { normalizeUrl } from './utils';
import { EditorState } from 'prosemirror-state';
import {
  linkToolbarMessages as linkToolbarCommonMessages,
  linkMessages,
} from '../../messages';
import { isSafeUrl, LinkAttributes } from '@atlaskit/adf-schema';
import {
  RECENT_SEARCH_HEIGHT_IN_PX,
  RECENT_SEARCH_WIDTH_IN_PX,
} from '../../ui/LinkSearch/ToolbarComponents';
import { HyperlinkToolbarAppearance } from './HyperlinkToolbarAppearance';
import { Command, CommandDispatch } from '../../types';
import {
  addAnalytics,
  ACTION_SUBJECT_ID,
  AnalyticsEventPayload,
} from '../analytics';
import {
  buildVisitedLinkPayload,
  buildOpenedSettingsPayload,
  LinkType,
} from '../../utils/linking-utils';
import { HyperlinkPluginOptions } from './types';
import { IntlShape } from 'react-intl-next';
import { getFeatureFlags } from '../feature-flags-context';

/* type guard for edit links */
function isEditLink(
  linkMark: EditInsertedState | InsertState,
): linkMark is EditInsertedState {
  return (linkMark as EditInsertedState).pos !== undefined;
}

const dispatchAnalytics = (
  dispatch: CommandDispatch | undefined,
  state: EditorState<any>,
  analyticsBuilder: (type: LinkType) => AnalyticsEventPayload<void>,
) => {
  if (dispatch) {
    dispatch(
      addAnalytics(
        state,
        state.tr,
        analyticsBuilder(ACTION_SUBJECT_ID.HYPERLINK),
      ),
    );
  }
};

const visitHyperlink = (): Command => (state, dispatch) => {
  dispatchAnalytics(dispatch, state, buildVisitedLinkPayload);
  return true;
};

const openLinkSettings = (): Command => (state, dispatch) => {
  dispatchAnalytics(dispatch, state, buildOpenedSettingsPayload);
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
  state: EditorState<any>,
  intl: IntlShape,
): FloatingToolbarItem<Command>[] => {
  const { floatingToolbarLinkSettingsButton } = getFeatureFlags(state);
  return floatingToolbarLinkSettingsButton === 'true'
    ? [
        { type: 'separator' },
        {
          id: 'editor.link.settings',
          type: 'button',
          icon: CogIcon,
          title: intl.formatMessage(linkToolbarCommonMessages.settingsLink),
          onClick: openLinkSettings(),
          href: 'https://id.atlassian.com/manage-profile/link-preferences',
          target: '_blank',
        },
      ]
    : [];
};

export const getToolbarConfig = (
  options?: HyperlinkPluginOptions,
): FloatingToolbarHandler => (state, intl, providerFactory) => {
  const { formatMessage } = intl;
  const linkState: HyperlinkState | undefined = stateKey.getState(state);

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
        const link = linkMark[0] && (linkMark[0].attrs as LinkAttributes).href;
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
            {
              type: 'custom',
              fallback: [],
              render: (editorView) => {
                return (
                  <HyperlinkToolbarAppearance
                    key="link-appearance"
                    url={link}
                    intl={intl}
                    editorView={editorView}
                    editorState={state}
                    cardOptions={options?.cardOptions}
                    providerFactory={providerFactory}
                    platform={options?.platform}
                  />
                );
              },
            },
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
              onClick: visitHyperlink(),
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
              onClick: removeLink(pos),
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
            ...getSettingsButtonGroup(state, intl),
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

        return {
          ...hyperLinkToolbar,
          height: RECENT_SEARCH_HEIGHT_IN_PX,
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
                  <HyperlinkAddToolbar
                    view={view}
                    key={idx}
                    linkPickerOptions={options?.linkPicker}
                    displayUrl={link}
                    displayText={displayText || ''}
                    providerFactory={providerFactory}
                    onSubmit={(href, title = '', displayText, inputMethod) => {
                      isEditLink(activeLinkMark)
                        ? updateLink(
                            href,
                            displayText || title,
                            activeLinkMark.pos,
                          )(view.state, view.dispatch)
                        : insertLinkWithAnalytics(
                            inputMethod,
                            activeLinkMark.from,
                            activeLinkMark.to,
                            href,
                            title,
                            displayText,
                            !!options?.cardOptions?.provider,
                          )(view.state, view.dispatch);
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
