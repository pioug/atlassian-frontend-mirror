import type { MediaADFAttrs } from '@atlaskit/adf-schema/media';
import { isFileIdentifier } from '@atlaskit/media-client/is-file-identifier';
import type { MediaViewerExtensions } from '@atlaskit/media-viewer/types';
import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';

import { getIdentifier } from './media-common';

// Tells the consumer which item the viewer opened on, or that it closed, before the viewer renders.
// media-card does the same for the viewers it opens, and Media Viewer reports navigation.
export const reportMediaViewerItem = (
	extensions: MediaViewerExtensions | undefined,
	media: MediaADFAttrs | null,
): void => {
	if (!UNSAFE_expValNoExposure('cc_comments_media_viewer_sidebar', 'isEnabled', false)) {
		return;
	}
	// No media means the viewer closed.
	if (!media) {
		extensions?.onSelectedItemChange?.(null);
		return;
	}
	const identifier = getIdentifier(media);
	// Include the placement, so a file placed more than once can be told apart.
	extensions?.onSelectedItemChange?.(
		isFileIdentifier(identifier) && 'occurrenceKey' in media && media.occurrenceKey
			? { ...identifier, occurrenceKey: media.occurrenceKey }
			: identifier,
	);
};
