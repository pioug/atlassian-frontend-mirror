import { MediaAttributes } from '@atlaskit/adf-schema';
import { stateKey as mediaPluginKey } from '../pm-plugins/plugin-key';
import type { Command } from '../../../types/command';
import type {
  MediaNodeWithPosHandler,
  MediaPluginState,
} from '../pm-plugins/types';
import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import { EditorState } from 'prosemirror-state';

/**
 * Note that Media Inline is inserted like a media single node into the media plugin state.
 * Though it is not of type mediaSingle, it shares the same `findMediaSingleNode` method
 *
 */
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

export const isMediaNode = (pos: number, state: EditorState) => {
  const node = state.doc.nodeAt(pos);
  return node && ['media', 'mediaInline'].includes(node.type.name);
};

export const updateAllMediaSingleNodesAttrs =
  (id: string, attrs: object): Command =>
  (state, dispatch) => {
    const mediaPluginState: MediaPluginState = mediaPluginKey.getState(state);

    let mediaNodes: MediaNodeWithPosHandler[];
    mediaNodes = findAllMediaSingleNodes(mediaPluginState, id);

    const validMediaNodePositions: number[] = mediaNodes.reduce<number[]>(
      (acc, { getPos }) => {
        const pos = getPos();
        if (
          isNaN(pos) ||
          (typeof pos === 'number' && !isMediaNode(pos, state))
        ) {
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

export const updateCurrentMediaNodeAttrs =
  (attrs: object, mediaNode: MediaNodeWithPosHandler): Command =>
  (state, dispatch) => {
    const pos = mediaNode.getPos();
    if (isNaN(pos) || (typeof pos === 'number' && !isMediaNode(pos, state))) {
      return false;
    }

    const tr = state.tr;
    tr.step(new SetAttrsStep(pos, attrs));
    tr.setMeta('addToHistory', false);

    if (dispatch) {
      dispatch(tr);
    }
    return true;
  };

export const updateMediaSingleNodeAttrs =
  (id: string, attrs: object): Command =>
  (state, dispatch) => {
    const mediaPluginState: MediaPluginState = mediaPluginKey.getState(state);

    const mediaNodeWithPos = findMediaSingleNode(mediaPluginState, id);

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

export const replaceExternalMedia =
  (pos: number, attrs: object): Command =>
  (state, dispatch) => {
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
