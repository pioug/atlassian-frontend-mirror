import React from 'react';

import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';

import { ProviderFactory } from '@atlaskit/editor-common';

import HyperlinkToolbar from '../../hyperlink/ui/HyperlinkAddToolbar';
import { showLinkToolbar, hideLinkToolbar } from '../pm-plugins/actions';

import { Command } from '../../../types';
import {
  FloatingToolbarItem,
  FloatingToolbarConfig,
} from '../../floating-toolbar/types';
import { addAnalytics, ACTION_SUBJECT_ID } from '../../analytics';

import {
  RECENT_SEARCH_HEIGHT_IN_PX,
  RECENT_SEARCH_WIDTH_IN_PX,
} from '../../../ui/LinkSearch/ToolbarComponents';

import { changeSelectedCardToLink, updateCard } from '../pm-plugins/doc';
import { findCardInfo, displayInfoForCard } from '../utils';
import { NodeSelection } from 'prosemirror-state';
import { buildEditLinkPayload } from '../../../utils/linking-utils';

export type EditLinkToolbarProps = {
  view: EditorView;
  providerFactory: ProviderFactory;
  url: string | undefined;
  text: string;
  node: Node;
  onSubmit?: (href: string, text?: string) => void;
};

export class EditLinkToolbar extends React.Component<EditLinkToolbarProps> {
  componentDidUpdate(prevProps: EditLinkToolbarProps) {
    if (prevProps.node !== this.props.node) {
      this.hideLinkToolbar();
    }
  }

  componentWillUnmount() {
    this.hideLinkToolbar();
  }

  private hideLinkToolbar() {
    const { view } = this.props;
    view.dispatch(hideLinkToolbar(view.state.tr));
  }

  render() {
    const { providerFactory, url, text, view, onSubmit } = this.props;

    return (
      <HyperlinkToolbar
        view={view}
        providerFactory={providerFactory}
        displayUrl={url}
        displayText={text}
        onSubmit={(href, title, displayText) => {
          this.hideLinkToolbar();
          if (onSubmit) {
            onSubmit(href, displayText || title);
          }
        }}
      />
    );
  }
}

export const editLink: Command = (state, dispatch) => {
  let type = 'hyperlink';
  if (state.selection instanceof NodeSelection) {
    type = state.selection.node.type.name;
  }
  if (dispatch) {
    dispatch(
      addAnalytics(
        state,
        showLinkToolbar(state.tr),
        buildEditLinkPayload(
          type as
            | ACTION_SUBJECT_ID.CARD_INLINE
            | ACTION_SUBJECT_ID.CARD_BLOCK
            | ACTION_SUBJECT_ID.EMBEDS,
        ),
      ),
    );
    return true;
  }

  return false;
};

export const buildEditLinkToolbar = ({
  providerFactory,
  node,
}: {
  providerFactory: ProviderFactory;
  node: Node;
}): FloatingToolbarItem<Command> => {
  return {
    type: 'custom',
    fallback: [],
    render: (view, idx) => {
      if (!view || !providerFactory) {
        return null;
      }

      const displayInfo = displayInfoForCard(node, findCardInfo(view.state));

      return (
        <EditLinkToolbar
          key={idx}
          view={view}
          providerFactory={providerFactory}
          url={displayInfo.url}
          text={displayInfo.title || ''}
          node={node}
          onSubmit={(newHref: string, newText?: string) => {
            const urlChanged = newHref !== displayInfo.url;
            const titleChanged = newText !== displayInfo.title;

            // If the title is changed in a smartlink, convert to standard blue hyperlink
            // (even if the url was also changed) - we don't want to lose the custom title.
            if (titleChanged) {
              return changeSelectedCardToLink(newText, newHref)(
                view.state,
                view.dispatch,
              );
            } else if (urlChanged) {
              // If *only* the url is changed in a smart link, reresolve
              return updateCard(newHref)(view.state, view.dispatch);
            }
            return;
          }}
        />
      );
    },
  };
};

export const editLinkToolbarConfig: Partial<FloatingToolbarConfig> = {
  height: RECENT_SEARCH_HEIGHT_IN_PX,
  width: RECENT_SEARCH_WIDTH_IN_PX,
  forcePlacement: true,
};
