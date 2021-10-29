import { MediaBaseAttributes } from '@atlaskit/adf-schema';
import { getMediaClient } from '@atlaskit/media-client';
import { EditorState } from 'prosemirror-state';
import {
  findParentNodeOfType,
  removeParentNodeOfType,
  removeSelectedNode,
} from 'prosemirror-utils';
import { MediaPluginState } from '../pm-plugins/types';

export const getSelectedMediaContainerNodeAttrs = (
  mediaPluginState: MediaPluginState,
): MediaBaseAttributes | null => {
  const selectedNode = mediaPluginState.selectedMediaContainerNode();
  if (selectedNode && selectedNode.attrs) {
    return selectedNode.attrs as MediaBaseAttributes;
  }
  return null;
};

export const downloadMedia = async (
  mediaPluginState: MediaPluginState,
): Promise<boolean> => {
  try {
    const selectedNodeAttrs = getSelectedMediaContainerNodeAttrs(
      mediaPluginState,
    );
    if (selectedNodeAttrs && mediaPluginState.mediaClientConfig) {
      const { id, collection = '' } = selectedNodeAttrs;
      const mediaClient = getMediaClient(mediaPluginState.mediaClientConfig);
      const fileState = await mediaClient.file.getCurrentState(id, {
        collectionName: collection,
      });
      const fileName =
        fileState.status === 'error' ? undefined : fileState.name;
      mediaClient.file.downloadBinary(id, fileName, collection);
    }
    return true;
  } catch (err) {
    return false;
  }
};

export const removeMediaGroupNode = (state: EditorState) => {
  const { mediaGroup } = state.schema.nodes;
  const mediaGroupParent = findParentNodeOfType(mediaGroup)(state.selection);

  let tr = state.tr;
  // If it is the last media group in filmstrip, remove the entire filmstrip
  if (mediaGroupParent && mediaGroupParent.node.childCount === 1) {
    tr = removeParentNodeOfType(mediaGroup)(tr);
  } else {
    tr = removeSelectedNode(tr);
  }
  return tr;
};
