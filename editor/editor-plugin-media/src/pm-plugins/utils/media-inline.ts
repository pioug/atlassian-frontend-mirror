import { mediaInlineImagesEnabled } from '@atlaskit/editor-common/media-inline';
import { isInEmptyLine } from '@atlaskit/editor-common/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { fg } from '@atlaskit/platform-feature-flags';

import type { MediaOptions } from '../../types';
import { canInsertMediaInline } from '../utils/media-files';
import { isMediaSingle } from '../utils/media-single';

import { isImage, isVideo } from './is-type';
import { isInsidePotentialEmptyParagraph } from './media-common';

type MediaNodeType = 'inline' | 'block' | 'group';

export const isInSupportedInlineImageParent = (state: EditorState): boolean => {
	return hasParentNodeOfType([state.schema.nodes.listItem])(state.selection);
};

export const getMediaNodeInsertionType = (
	state: EditorState,
	mediaOptions?: MediaOptions,
	fileMimeType?: string,
): MediaNodeType => {
	if (isImage(fileMimeType) && fg('platform_editor_media_block_default')) {
		if (isMediaSingle(state.schema, fileMimeType)) {
			return 'block';
		}
		return 'group';
	}

	const canInsertInlineNode =
		getMediaFeatureFlag('mediaInline', mediaOptions?.featureFlags) &&
		!isInEmptyLine(state) &&
		(!isInsidePotentialEmptyParagraph(state) || isInSupportedInlineImageParent(state)) &&
		canInsertMediaInline(state);

	if (fg('platform_editor_remove_media_inline_feature_flag')) {
		if (mediaOptions?.allowMediaInlineImages) {
			if (canInsertInlineNode && !isVideo(fileMimeType)) {
				return 'inline';
			}
		}
	} else {
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
	}

	if (isMediaSingle(state.schema, fileMimeType)) {
		return 'block';
	} else if (canInsertInlineNode) {
		return 'inline';
	}
	return 'group';
};
