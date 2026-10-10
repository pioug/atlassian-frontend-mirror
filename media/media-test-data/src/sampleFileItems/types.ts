import type { FileIdentifier } from '@atlaskit/media-client/identifier';
import type { ResponseFileItem } from '@atlaskit/media-client/media-store/types';
import type { PartialResponseFileItem } from '@atlaskit/media-client/test-helpers';

export interface FileItemGenerator {
	(override?: PartialResponseFileItem): [ResponseFileItem, FileIdentifier];
}
