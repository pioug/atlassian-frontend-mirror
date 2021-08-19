import React from 'react';
import { FloatingToolbarHandler, AlignType } from '../floating-toolbar/types';
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
import { Command } from '../../types';
import { addAnalytics, ACTION_SUBJECT_ID } from '../analytics';
import { buildVisitedLinkPayload } from '../../utils/linking-utils';

/* type guard for edit links */
function isEditLink(
  linkMark: EditInsertedState | InsertState,
): linkMark is EditInsertedState {
  return (linkMark as EditInsertedState).pos !== undefined;
}

const visitHyperlink = (): Command => (state, dispatch) => {
  if (dispatch) {
    dispatch(
      addAnalytics(
        state,
        state.tr,
        buildVisitedLinkPayload(ACTION_SUBJECT_ID.HYPERLINK),
      ),
    );
  }
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

export const getToolbarConfig: FloatingToolbarHandler = (
  state,
  intl,
  providerFactory,
  cardOptions,
) => {
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
                    cardOptions={cardOptions}
                    providerFactory={providerFactory}
                    // platform={} // TODO: pass platform
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
            },
          ],
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
              render: (
                view?: EditorView,
                idx?: number,
              ):
                | React.ComponentClass
                | React.SFC
                | React.ReactElement<any>
                | null => {
                if (!view) {
                  return null;
                }
                return (
                  <HyperlinkAddToolbar
                    view={view}
                    key={idx}
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
                            !!(cardOptions && cardOptions.provider),
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
