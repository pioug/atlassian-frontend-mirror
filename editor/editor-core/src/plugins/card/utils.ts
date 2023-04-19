import { EditorState, NodeSelection } from 'prosemirror-state';
import { NodeType, Node, Slice, Fragment } from 'prosemirror-model';
import { CardAppearance } from '@atlaskit/editor-common/provider-factory';
import { CardInfo } from './types';
import { CardPluginState } from './types';
import { pluginKey } from './pm-plugins/plugin-key';
import { mapChildren } from '../../utils/slice';
import { isSupportedInParent } from '../../utils/nodes';
import { CardOptions } from '@atlaskit/editor-common/card';

export const appearanceForNodeType = (
  spec: NodeType,
): CardAppearance | undefined => {
  if (spec.name === 'inlineCard') {
    return 'inline';
  } else if (spec.name === 'blockCard') {
    return 'block';
  } else if (spec.name === 'embedCard') {
    return 'embed';
  }
  return;
};

export const selectedCardAppearance = (state: EditorState) => {
  if (state.selection instanceof NodeSelection) {
    return appearanceForNodeType(state.selection.node.type);
  }
};

export type TitleUrlPair = { title?: string; url?: string };

export const titleUrlPairFromNode = (node: Node): TitleUrlPair => {
  const { attrs } = node;

  return {
    url: attrs.url || (attrs.data && attrs.data.url),
    title: attrs.data && attrs.data.title,
  };
};

/**
 * Merges the title and url from attributes and CardInfo from the resolved view, preferring the CardInfo.
 * @param titleUrlPair title and url information from the node attributes
 * @param info information stored in state from the resolved UI component view
 */
export const mergeCardInfo = (
  titleUrlPair: TitleUrlPair,
  info?: CardInfo,
): TitleUrlPair => {
  return {
    title: (info && info.title) || titleUrlPair.title,
    url: (info && info.url) || titleUrlPair.url,
  };
};

export const displayInfoForCard = (node: Node, info?: CardInfo) =>
  mergeCardInfo(titleUrlPairFromNode(node), info);

export const findCardInfo = (state: EditorState) => {
  const pluginState: CardPluginState = pluginKey.getState(state);
  return pluginState.cards.find(
    (cardInfo) => cardInfo.pos === state.selection.from,
  );
};

export const transformUnsupportedBlockCardToInline = (
  slice: Slice,
  state: EditorState,
  cardOptions?: CardOptions,
): Slice => {
  const { blockCard, inlineCard } = state.schema.nodes;
  const children = [] as Node[];

  mapChildren(slice.content, (node: Node, i: number, frag: Fragment) => {
    if (
      node.type === blockCard &&
      !isBlockCardSupported(state, frag, cardOptions?.allowBlockCards ?? false)
    ) {
      children.push(
        inlineCard.createChecked(node.attrs, node.content, node.marks),
      );
    } else {
      children.push(node);
    }
  });

  return new Slice(
    Fragment.fromArray(children),
    slice.openStart,
    slice.openEnd,
  );
};
/**
 * Function to determine if a block card is supported by the editor
 * @param state
 * @param frag
 * @param allowBlockCards
 * @returns
 */
const isBlockCardSupported = (
  state: EditorState,
  frag: Fragment<any>,
  allowBlockCards: boolean,
) => {
  return allowBlockCards && isSupportedInParent(state, frag);
};
