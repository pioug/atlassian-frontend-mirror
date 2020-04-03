import { InjectedIntl, defineMessages } from 'react-intl';
import { EditorState, NodeSelection } from 'prosemirror-state';
import { removeSelectedNode } from 'prosemirror-utils';

import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';

import { analyticsService } from '../../analytics';
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
import {
  changeSelectedCardToText,
  setSelectedCardAppearance,
} from './pm-plugins/doc';
import { CardPluginState, CardOptions } from './types';
import { pluginKey } from './pm-plugins/main';
import { ProviderFactory } from '@atlaskit/editor-common';
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

export const messages = defineMessages({
  block: {
    id: 'fabric.editor.displayBlock',
    defaultMessage: 'Display as card',
    description:
      'Display link as a card with a rich preview similar to in a Facebook feed with page title, description, and potentially an image.',
  },
  inline: {
    id: 'fabric.editor.displayInline',
    defaultMessage: 'Display inline',
    description: 'Display link with the title only.',
  },
  embed: {
    id: 'fabric.editor.displayEmbed',
    defaultMessage: 'Display as embed',
    description: 'Display link as an embedded object',
  },
  link: {
    id: 'fabric.editor.displayLink',
    defaultMessage: 'Display as text',
    description: 'Convert the card to become a regular text-based hyperlink.',
  },
  card: {
    id: 'fabric.editor.cardFloatingControls',
    defaultMessage: 'Card options',
    description: 'Options to change card type',
  },
});

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
  analyticsService.trackEvent('atlassian.editor.format.card.delete.button');
  return true;
};

export const visitCardLink: Command = (state, dispatch) => {
  if (!(state.selection instanceof NodeSelection)) {
    return false;
  }

  const { type } = state.selection.node;
  const { url } = titleUrlPairFromNode(state.selection.node);

  const payload: AnalyticsEventPayload = {
    action: ACTION.VISITED,
    actionSubject: ACTION_SUBJECT.SMART_LINK,
    actionSubjectId: type.name as
      | ACTION_SUBJECT_ID.CARD_INLINE
      | ACTION_SUBJECT_ID.CARD_BLOCK,
    attributes: {
      inputMethod: INPUT_METHOD.TOOLBAR,
    },
    eventType: EVENT_TYPE.TRACK,
  };

  // All card links should open in the same tab per https://product-fabric.atlassian.net/browse/MS-1583.
  analyticsService.trackEvent('atlassian.editor.format.card.visit.button');
  // We are in edit mode here, open the smart card URL in a new window.
  window.open(url);

  if (dispatch) {
    dispatch(addAnalytics(state, state.tr, payload));
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

const generateDeleteButton = (
  node: Node,
  state: EditorState,
  intl: InjectedIntl,
): FloatingToolbarItem<Command> => {
  const { inlineCard } = state.schema.nodes;
  if (node.type === inlineCard) {
    return {
      type: 'button',
      title: intl.formatMessage(linkToolbarMessages.unlink),
      icon: UnlinkIcon,
      onClick: unlinkCard(node, state),
    };
  }

  return {
    type: 'button',
    appearance: 'danger',
    icon: RemoveIcon,
    onMouseEnter: hoverDecoration(node.type, true),
    onMouseLeave: hoverDecoration(node.type, false),
    title: intl.formatMessage(commonMessages.remove),
    onClick: removeCard,
  };
};

const generateToolbarItems = (
  state: EditorState,
  intl: InjectedIntl,
  providerFactory: ProviderFactory,
  cardOptions: CardOptions,
) => (node: Node): Array<FloatingToolbarItem<Command>> => {
  const { url } = titleUrlPairFromNode(node);
  if (url && !isSafeUrl(url)) {
    return [];
  }

  const pluginState: CardPluginState = pluginKey.getState(state);

  const currentAppearance = appearanceForNodeType(node.type);

  if (pluginState.showLinkingToolbar) {
    return [
      buildEditLinkToolbar({
        providerFactory,
        node,
      }),
    ];
  } else {
    const toolbarItems: Array<FloatingToolbarItem<Command>> = [
      {
        type: 'button',
        selected: false,
        title: intl.formatMessage(linkToolbarMessages.editLink),
        showTitle: true,
        onClick: editLink,
      },
      { type: 'separator' },
      {
        type: 'button',
        icon: OpenIcon,
        className: 'hyperlink-open-link',
        title: intl.formatMessage(linkMessages.openLink),
        onClick: visitCardLink,
      },
      { type: 'separator' },
      generateDeleteButton(node, state, intl),
    ];

    if (cardOptions.allowBlockCards && currentAppearance) {
      const options = [
        {
          title: intl.formatMessage(messages.block),
          onClick: setSelectedCardAppearance('block'),
          selected: currentAppearance === 'block',
          hidden: false,
        },
        {
          title: intl.formatMessage(messages.inline),
          onClick: setSelectedCardAppearance('inline'),
          selected: currentAppearance === 'inline',
          hidden: false,
        },
      ];

      toolbarItems.unshift({
        type: 'dropdown',
        options,
        hidden: false,
        title: intl.formatMessage(messages[currentAppearance]),
      });
    }

    return toolbarItems;
  }
};

export const floatingToolbar = (cardOptions: CardOptions) => {
  return (
    state: EditorState,
    intl: InjectedIntl,
    providerFactory: ProviderFactory,
  ): FloatingToolbarConfig | undefined => {
    const { inlineCard, blockCard } = state.schema.nodes;
    const nodeType = [inlineCard, blockCard];

    const pluginState: CardPluginState = pluginKey.getState(state);

    return {
      title: intl.formatMessage(messages.card),
      nodeType,
      items: generateToolbarItems(state, intl, providerFactory, cardOptions),
      ...(pluginState.showLinkingToolbar ? editLinkToolbarConfig : {}),
    };
  };
};
