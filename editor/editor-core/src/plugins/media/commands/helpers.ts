import { MediaAttributes } from '@atlaskit/adf-schema';
import { stateKey as mediaPluginKey } from '../pm-plugins/plugin-key';
import type { Command } from '../../../types/command';
import type {
  MediaNodeWithPosHandler,
  MediaPluginState,
} from '../pm-plugins/types';
import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import { EditorState } from 'prosemirror-state';

export const findMediaSingleNode = (
  mediaPluginState: MediaPluginState,
  id: string,
): MediaNodeWithPosHandler | null => {
  const { mediaNodes } = mediaPluginState;

  // Array#find... no IE support
  return mediaNodes.reduce(
    (
      memo: MediaNodeWithPosHandler | null,
      nodeWithPos: MediaNodeWithPosHandler,
    ) => {
      if (memo) {
        return memo;
      }

      const { node } = nodeWithPos;
      if (node.attrs.id === id) {
        return nodeWithPos;
      }

      return memo;
    },
    null,
  );
};

/**
 * Finds the media inline node with the given id.
 * Media Inline is inserted like a media single node into the media plugin state.
 * However it is not of type mediaSingle.
 *
 * @param mediaPluginState
 * @param id
 * @param isMediaSingle
 * @returns {MediaNodeWithPosHandler | null}
 */
export const findMediaInlineNode = (
  mediaPluginState: MediaPluginState,
  id: string,
  isMediaSingle: boolean,
): MediaNodeWithPosHandler | null => {
  if (!isMediaSingle) {
    return findMediaSingleNode(mediaPluginState, id);
  }
  return null;
};

export const findAllMediaSingleNodes = (
  mediaPluginState: MediaPluginState,
  id: string,
): MediaNodeWithPosHandler[] => {
  const { mediaNodes } = mediaPluginState;

  return mediaNodes.filter(
    (nodeWithHandler) =>
      (nodeWithHandler.node.attrs as MediaAttributes).id === id,
  );
};

export const findMediaNode = (
  mediaPluginState: MediaPluginState,
  id: string,
  isMediaSingle: boolean,
): MediaNodeWithPosHandler | null => {
  const mediaNodeWithPos = isMediaSingle
    ? findMediaSingleNode(mediaPluginState, id)
    : mediaPluginState.mediaGroupNodes[id];

  // Should attempt to find media inline node if media single node or media group node is not found
  if (!mediaNodeWithPos) {
    return findMediaInlineNode(mediaPluginState, id, isMediaSingle);
  }

  return mediaNodeWithPos;
};

export const isMediaNode = (pos: number, state: EditorState) => {
  const node = state.doc.nodeAt(pos);
  return node && ['media', 'mediaInline'].includes(node.type.name);
};

export const updateAllMediaNodesAttrs = (
  id: string,
  attrs: object,
  isMediaSingle: boolean,
): Command => (state, dispatch) => {
  const mediaPluginState: MediaPluginState = mediaPluginKey.getState(state);

  let mediaNodes: MediaNodeWithPosHandler[];
  if (isMediaSingle) {
    mediaNodes = findAllMediaSingleNodes(mediaPluginState, id);
  } else {
    const mediaGroupNode = findMediaNode(mediaPluginState, id, isMediaSingle);
    mediaNodes = mediaGroupNode ? [mediaGroupNode] : [];
  }

  const validMediaNodePositions: number[] = mediaNodes.reduce<number[]>(
    (acc, { getPos }) => {
      const pos = getPos();
      if (typeof pos === 'number' && !isMediaNode(pos, state)) {
        return acc;
      }

      acc.push(pos);
      return acc;
    },
    [],
  );

  if (validMediaNodePositions.length === 0) {
    return false;
  }

  const tr = state.tr;
  validMediaNodePositions.forEach((pos) =>
    tr.step(new SetAttrsStep(pos, attrs)),
  );

  tr.setMeta('addToHistory', false);

  if (dispatch) {
    dispatch(tr);
  }
  return true;
};
export const updateMediaNodeAttrs = (
  id: string,
  attrs: object,
  isMediaSingle: boolean,
): Command => (state, dispatch) => {
  const mediaPluginState: MediaPluginState = mediaPluginKey.getState(state);

  const mediaNodeWithPos = findMediaNode(mediaPluginState, id, isMediaSingle);

  if (!mediaNodeWithPos) {
    return false;
  }

  const tr = state.tr;
  const pos = mediaNodeWithPos.getPos();

  if (!isMediaNode(pos, state)) {
    return false;
  }

  tr.step(new SetAttrsStep(pos, attrs)).setMeta('addToHistory', false);
  if (dispatch) {
    dispatch(tr);
  }
  return true;
};

export const replaceExternalMedia = (pos: number, attrs: object): Command => (
  state,
  dispatch,
) => {
  const tr = state.tr;

  const node = tr.doc.nodeAt(pos);
  if (!node || node.type.name !== 'media') {
    return false;
  }

  tr.step(
    new SetAttrsStep(pos, {
      type: 'file',
      url: null,
      ...attrs,
    }),
  ).setMeta('addToHistory', false);

  if (dispatch) {
    dispatch(tr);
  }
  return true;
};
