import { MediaAttributes } from '@atlaskit/adf-schema';
import { stateKey as mediaPluginKey } from '../pm-plugins/plugin-key';
import { Command } from '../../../types/command';
import { MediaNodeWithPosHandler, MediaPluginState } from '../pm-plugins/types';
import { SetAttrsStep } from '@atlaskit/adf-schema/steps';

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

export const findMediaNode = (
  mediaPluginState: MediaPluginState,
  id: string,
  isMediaSingle: boolean,
): MediaNodeWithPosHandler | null => {
  const mediaNodeWithPos = isMediaSingle
    ? findMediaSingleNode(mediaPluginState, id)
    : mediaPluginState.mediaGroupNodes[id];
  return mediaNodeWithPos;
};

export const isMobileUploadCompleted = (
  mediaPluginState: MediaPluginState,
  mediaId: string,
): boolean | undefined =>
  !!mediaPluginState.mediaOptions &&
  // This flag tells us that it's a 'mobile' env.
  !!mediaPluginState.mediaOptions.allowMarkingUploadsAsIncomplete &&
  typeof mediaPluginState.mobileUploadComplete[mediaId] === 'boolean'
    ? mediaPluginState.mobileUploadComplete[mediaId]
    : undefined;

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

  // TODO: ED-7784 Clean media plugin state from having media that were previously removed.
  // Sanity check
  const mediaType = state.schema.nodes.media;
  mediaNodes = mediaNodes.filter((nodeWithPos) => {
    let node;
    try {
      node = state.doc.nodeAt(nodeWithPos.getPos());
    } catch (e) {
      return false;
    }

    return node && node.type === mediaType;
  });

  if (mediaNodes.length === 0) {
    return false;
  }

  if (dispatch) {
    const tr = state.tr;
    mediaNodes.forEach(({ getPos }) =>
      tr.step(new SetAttrsStep(getPos(), attrs)),
    );
    tr.setMeta('addToHistory', false);
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

  if (dispatch) {
    dispatch(
      state.tr
        .step(new SetAttrsStep(mediaNodeWithPos.getPos(), attrs))
        .setMeta('addToHistory', false),
    );
  }
  return true;
};
export const replaceExternalMedia = (pos: number, attrs: object): Command => (
  state,
  dispatch,
) => {
  if (dispatch) {
    dispatch(
      state.tr
        .step(
          new SetAttrsStep(pos, {
            type: 'file',
            url: null,
            ...attrs,
          }),
        )
        .setMeta('addToHistory', false),
    );
    return true;
  }
  return false;
};
