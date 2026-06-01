/* eslint-disable @atlassian/relay/unused-fields, @atlassian/relay/must-use-inline, @atlassian/relay/graphql-naming, @atlassian/relay/no-wrapping-hooks */
import { graphql, useFragment } from 'react-relay';

import type {
	mediaCardFragment_mediaItem$data,
	mediaCardFragment_mediaItem$key,
} from './__generated__/mediaCardFragment_mediaItem.graphql';

export const useMediaCardFragment = function (
	mediaItemRef?: mediaCardFragment_mediaItem$key | null,
): mediaCardFragment_mediaItem$data | null | undefined {
	const mediaItem = useFragment(
		graphql`
			fragment mediaCardFragment_mediaItem on MediaItem {
				id
				type
				details {
					name
					size
					mimeType
					mediaType
					processingStatus
					failReason
					createdAt
					preview {
						cdnUrl
					}
					artifactsList {
						createdAt
						mimeType
						name
						processingStatus
						size
						url
					}
					representations {
						image {
							_empty
						}
					}
					mediaMetadata {
						duration
					}
					abuseClassification {
						classification
						confidence
					}
				}
			}
		`,
		mediaItemRef,
	);

	return mediaItem;
};
