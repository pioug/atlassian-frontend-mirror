import { MediaBaseAttributes } from '@atlaskit/adf-schema';
import { getMediaClient } from '@atlaskit/media-client';
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
