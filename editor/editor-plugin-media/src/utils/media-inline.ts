import { mediaInlineImagesEnabled } from '@atlaskit/editor-common/media-inline';
import { isInEmptyLine } from '@atlaskit/editor-common/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { getMediaFeatureFlag } from '@atlaskit/media-common';

import type { MediaOptions } from '../types';
import { canInsertMediaInline } from '../utils/media-files';
import { isMediaSingle } from '../utils/media-single';

import { isVideo } from './is-type';
import { isInsidePotentialEmptyParagraph } from './media-common';

export type MediaNodeType = 'inline' | 'block' | 'group';

export const isInSupportedInlineImageParent = (state: EditorState): boolean => {
  return hasParentNodeOfType([state.schema.nodes.listItem])(state.selection);
};

export const getMediaNodeInsertionType = (
  state: EditorState,
  mediaOptions?: MediaOptions,
  fileMimeType?: string,
): MediaNodeType => {
  const canInsertInlineNode =
    getMediaFeatureFlag('mediaInline', mediaOptions?.featureFlags) &&
    !isInEmptyLine(state) &&
    (!isInsidePotentialEmptyParagraph(state) ||
      isInSupportedInlineImageParent(state)) &&
    canInsertMediaInline(state);

  if (
    mediaInlineImagesEnabled(
      getMediaFeatureFlag('mediaInline', mediaOptions?.featureFlags),
      mediaOptions?.allowMediaInlineImages,
    )
  ) {
    if (canInsertInlineNode && !isVideo(fileMimeType)) {
      return 'inline';
    }
  }

  if (isMediaSingle(state.schema, fileMimeType)) {
    return 'block';
  } else if (canInsertInlineNode) {
    return 'inline';
  }

  return 'group';
};
