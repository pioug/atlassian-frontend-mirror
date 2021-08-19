import React from 'react';
import { InjectedIntl } from 'react-intl';
import { EditorState, NodeSelection } from 'prosemirror-state';
import { removeSelectedNode, findDomRefAtPos } from 'prosemirror-utils';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';
import { CardPlatform } from '@atlaskit/smart-card';

import { Command } from '../../types';
import {
  FloatingToolbarConfig,
  FloatingToolbarItem,
} from '../floating-toolbar/types';
import {
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
  addAnalytics,
  AnalyticsEventPayload,
  ACTION_SUBJECT_ID,
} from '../analytics';
import { linkToolbarMessages, linkMessages } from '../../messages';
import commonMessages from '../../messages';

import { Node } from 'prosemirror-model';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { changeSelectedCardToText } from './pm-plugins/doc';
import { CardPluginState } from './types';
import { CardOptions } from '@atlaskit/editor-common';
import { pluginKey } from './pm-plugins/main';
import { ProviderFactory, richMediaClassName } from '@atlaskit/editor-common';
import {
  buildEditLinkToolbar,
  editLink,
  editLinkToolbarConfig,
} from './ui/EditLinkToolbar';
import {
  displayInfoForCard,
  findCardInfo,
  titleUrlPairFromNode,
  appearanceForNodeType,
} from './utils';
import { isSafeUrl } from '@atlaskit/adf-schema';
import { LinkToolbarAppearance } from './ui/LinkToolbarAppearance';
import { messages } from './messages';
import buildLayoutButtons from '../../ui/MediaAndEmbedsToolbar';
import { buildVisitedLinkPayload } from '../../utils/linking-utils';

export const removeCard: Command = (state, dispatch) => {
  if (!(state.selection instanceof NodeSelection)) {
    return false;
  }

  const type = state.selection.node.type.name;
  const payload: AnalyticsEventPayload = {
    action: ACTION.DELETED,
    actionSubject: ACTION_SUBJECT.SMART_LINK,
    actionSubjectId: type as
      | ACTION_SUBJECT_ID.CARD_INLINE
      | ACTION_SUBJECT_ID.CARD_BLOCK,
    attributes: {
      inputMethod: INPUT_METHOD.TOOLBAR,
      displayMode: type as
        | ACTION_SUBJECT_ID.CARD_INLINE
        | ACTION_SUBJECT_ID.CARD_BLOCK,
    },
    eventType: EVENT_TYPE.TRACK,
  };
  if (dispatch) {
    dispatch(addAnalytics(state, removeSelectedNode(state.tr), payload));
  }
  return true;
};

export const visitCardLink: Command = (state, dispatch) => {
  if (!(state.selection instanceof NodeSelection)) {
    return false;
  }

  const { type } = state.selection.node;
  const { url } = titleUrlPairFromNode(state.selection.node);

  // All card links should open in the same tab per https://product-fabric.atlassian.net/browse/MS-1583.
  // We are in edit mode here, open the smart card URL in a new window.
  window.open(url);

  if (dispatch) {
    dispatch(
      addAnalytics(
        state,
        state.tr,
        buildVisitedLinkPayload(
          type.name as
            | ACTION_SUBJECT_ID.CARD_INLINE
            | ACTION_SUBJECT_ID.CARD_BLOCK
            | ACTION_SUBJECT_ID.EMBEDS,
        ),
      ),
    );
  }
  return true;
};

const unlinkCard = (node: Node, state: EditorState): Command => {
  const displayInfo = displayInfoForCard(node, findCardInfo(state));
  const text = displayInfo.title || displayInfo.url;
  if (text) {
    return changeSelectedCardToText(text);
  }

  return () => false;
};

const buildAlignmentOptions = (
  state: EditorState,
  intl: InjectedIntl,
): FloatingToolbarItem<Command>[] => {
  return buildLayoutButtons(
    state,
    intl,
    state.schema.nodes.embedCard,
    true,
    true,
  );
};

const generateDeleteButton = (
  node: Node,
  state: EditorState,
  intl: InjectedIntl,
): Array<FloatingToolbarItem<Command>> => {
  const { inlineCard } = state.schema.nodes;
  const removeButton: FloatingToolbarItem<Command> = {
    id: 'editor.link.delete',
    type: 'button',
    appearance: 'danger',
    icon: RemoveIcon,
    onMouseEnter: hoverDecoration(node.type, true),
    onMouseLeave: hoverDecoration(node.type, false),
    onFocus: hoverDecoration(node.type, true),
    onBlur: hoverDecoration(node.type, false),
    title: intl.formatMessage(commonMessages.remove),
    onClick: removeCard,
  };
  if (node.type === inlineCard) {
    const unlinkButtonWithSeparator: Array<FloatingToolbarItem<Command>> = [
      {
        id: 'editor.link.unlink',
        type: 'button',
        title: intl.formatMessage(linkToolbarMessages.unlink),
        icon: UnlinkIcon,
        onClick: unlinkCard(node, state),
      },
      { type: 'separator' },
    ];
    return [...unlinkButtonWithSeparator, removeButton];
  }

  return [removeButton];
};

const generateToolbarItems = (
  state: EditorState,
  intl: InjectedIntl,
  providerFactory: ProviderFactory,
  cardOptions: CardOptions,
  platform?: CardPlatform,
) => (node: Node): Array<FloatingToolbarItem<Command>> => {
  const { url } = titleUrlPairFromNode(node);
  let metadata = {};
  if (url && !isSafeUrl(url)) {
    return [];
  } else {
    const { title } = displayInfoForCard(node, findCardInfo(state));
    metadata = {
      url: url,
      title: title,
    };
  }

  const pluginState: CardPluginState = pluginKey.getState(state);

  const currentAppearance = appearanceForNodeType(node.type);

  /* mobile builds toolbar natively using toolbarItems */
  if (pluginState.showLinkingToolbar && platform !== 'mobile') {
    return [
      buildEditLinkToolbar({
        providerFactory,
        node,
      }),
    ];
  } else {
    const toolbarItems: Array<FloatingToolbarItem<Command>> = [
      {
        id: 'editor.link.edit',
        type: 'button',
        selected: false,
        metadata: metadata,
        title: intl.formatMessage(linkToolbarMessages.editLink),
        showTitle: true,
        testId: 'link-toolbar-edit-link-button',
        onClick: editLink,
      },
      { type: 'separator' },
      {
        id: 'editor.link.openLink',
        type: 'button',
        icon: OpenIcon,
        metadata: metadata,
        className: 'hyperlink-open-link',
        title: intl.formatMessage(linkMessages.openLink),
        onClick: visitCardLink,
      },
      { type: 'separator' },
      ...generateDeleteButton(node, state, intl),
    ];

    if (currentAppearance === 'embed') {
      const alignmentOptions = buildAlignmentOptions(state, intl);
      if (alignmentOptions.length) {
        alignmentOptions.push({
          type: 'separator',
        });
      }
      toolbarItems.unshift(...alignmentOptions);
    }
    const { allowBlockCards, allowEmbeds } = cardOptions;

    if ((allowBlockCards || allowEmbeds) && currentAppearance) {
      toolbarItems.unshift(
        {
          type: 'custom',
          fallback: [],
          render: (editorView) => (
            <LinkToolbarAppearance
              key="link-appearance"
              url={url}
              intl={intl}
              currentAppearance={currentAppearance}
              editorView={editorView}
              editorState={state}
              allowEmbeds={allowEmbeds}
              platform={platform}
            />
          ),
        },
        {
          type: 'separator',
        },
      );
    }

    return toolbarItems;
  }
};

export const floatingToolbar = (
  cardOptions: CardOptions,
  platform?: CardPlatform,
) => {
  return (
    state: EditorState,
    intl: InjectedIntl,
    providerFactory: ProviderFactory,
  ): FloatingToolbarConfig | undefined => {
    const { inlineCard, blockCard, embedCard } = state.schema.nodes;
    const nodeType = [inlineCard, blockCard, embedCard];
    const pluginState: CardPluginState = pluginKey.getState(state);
    if (!(state.selection instanceof NodeSelection)) {
      return;
    }
    const selectedNode = state.selection.node;

    if (!selectedNode) {
      return;
    }

    const isEmbedCard = appearanceForNodeType(selectedNode.type) === 'embed';

    /* add an offset to embeds due to extra padding */
    const toolbarOffset: { offset: [number, number] } | {} = isEmbedCard
      ? {
          offset: [0, 24],
        }
      : {};

    return {
      title: intl.formatMessage(messages.card),
      nodeType,
      ...toolbarOffset,
      getDomRef: (view) => {
        const element = findDomRefAtPos(
          view.state.selection.from,
          view.domAtPos.bind(view),
        ) as HTMLElement;
        if (!element) {
          return undefined;
        }
        if (isEmbedCard) {
          return element.querySelector(`.${richMediaClassName}`) as HTMLElement;
        }
        return element;
      },

      items: generateToolbarItems(
        state,
        intl,
        providerFactory,
        cardOptions,
        platform,
      ),
      ...(pluginState.showLinkingToolbar ? editLinkToolbarConfig : {}),
    };
  };
};
