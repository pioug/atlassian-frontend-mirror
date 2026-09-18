import type { MediaFileArtifacts } from '@atlaskit/media-state/file-state';

import { type ResponseFileItem } from '../../client/media-store/types';
import { type MediaItemDetails } from '../../models/media';

export type PartialResponseFileItem = Omit<Partial<ResponseFileItem>, 'details'> & {
	details?: Partial<MediaItemDetails> & {
		artifacts?: Partial<MediaFileArtifacts>;
	};
};
