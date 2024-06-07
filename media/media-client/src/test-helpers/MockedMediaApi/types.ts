import { type ResponseFileItem } from '../../client/media-store/types';
import { type MediaItemDetails } from '../../models/media';
import { type MediaFileArtifacts } from '@atlaskit/media-state';

export type PartialResponseFileItem = Omit<Partial<ResponseFileItem>, 'details'> & {
	details?: Partial<MediaItemDetails> & {
		artifacts?: Partial<MediaFileArtifacts>;
	};
};
