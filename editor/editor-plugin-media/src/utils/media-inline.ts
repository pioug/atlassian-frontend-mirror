import { isInEmptyLine, isInListItem } from '@atlaskit/editor-common/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { MediaFeatureFlags } from '@atlaskit/media-common';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { canInsertMediaInline } from '../utils/media-files';
import { isMediaSingle } from '../utils/media-single';

import { isVideo } from './is-type';
import { isInsidePotentialEmptyParagraph } from './media-common';

export type MediaNodeType = 'inline' | 'block' | 'group';

export const getMediaNodeInsertionType = (
  state: EditorState,
  mediaFeatureFlags?: MediaFeatureFlags,
  fileMimeType?: string,
): MediaNodeType => {
  const canInsertInlineNode =
    getMediaFeatureFlag('mediaInline', mediaFeatureFlags) &&
    !isInEmptyLine(state) &&
    (!isInsidePotentialEmptyParagraph(state) || isInListItem(state)) &&
    canInsertMediaInline(state);

  if (getBooleanFF('platform.editor.media.inline-image.base-support')) {
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
