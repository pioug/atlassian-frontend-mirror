import type {
  MediaBaseAttributes,
  RichMediaLayout,
} from '@atlaskit/adf-schema';
import { wrappedLayouts } from '@atlaskit/editor-common/media-single';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import {
  findParentNodeOfType,
  findSelectedNodeOfType,
  removeParentNodeOfType,
  removeSelectedNode,
} from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFullWidthLayoutWidth } from '@atlaskit/editor-shared-styles';
import { getMediaClient } from '@atlaskit/media-client';

import type { MediaPluginState } from '../pm-plugins/types';

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
    const selectedNodeAttrs =
      getSelectedMediaContainerNodeAttrs(mediaPluginState);
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

export const getSelectedMediaSingle = (state: EditorState) => {
  const { mediaSingle } = state.schema.nodes;

  return (
    findSelectedNodeOfType(mediaSingle)(state.selection) ||
    findParentNodeOfType(mediaSingle)(state.selection)
  );
};

export const getPixelWidthOfElement = (
  editorView: EditorView,
  pos: number,
  mediaWidth: number,
) => {
  const domNode = editorView.nodeDOM(pos);
  if (domNode instanceof HTMLElement) {
    return domNode.offsetWidth;
  }
  return mediaWidth;
};

export const calcNewLayout = (
  width: number,
  layout: RichMediaLayout,
  contentWidth: number,
  fullWidthMode = false,
) => {
  const isWrappedLayout = wrappedLayouts.indexOf(layout) > -1;
  if (width >= akEditorFullWidthLayoutWidth) {
    // If width is greater than or equal to full editor width
    return 'full-width';
  }

  if (fullWidthMode) {
    // If under editor full width mode
    return isWrappedLayout ? layout : 'center';
  }

  if (width > contentWidth) {
    // If width is greater than content length and not nested
    return 'wide';
  }

  return isWrappedLayout && width !== contentWidth ? layout : 'center';
};

let maxToolbarFitWidth = 0;

export const getMaxToolbarWidth = () => {
  const toolbar = document.querySelector(
    `div[aria-label="Media floating controls"]`,
  ) as HTMLElement;
  const toolbarWidth = toolbar?.getBoundingClientRect().width;
  if (!toolbar) {
    maxToolbarFitWidth = 0;
  }
  if (toolbarWidth && toolbarWidth > maxToolbarFitWidth) {
    maxToolbarFitWidth = toolbarWidth;
  }
  return maxToolbarFitWidth;
};
