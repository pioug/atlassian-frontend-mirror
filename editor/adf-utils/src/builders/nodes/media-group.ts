import type { MediaDefinition } from '@atlaskit/adf-schema/media';
import type { MediaGroupDefinition } from '@atlaskit/adf-schema/media-group';

export const mediaGroup = (...content: Array<MediaDefinition>): MediaGroupDefinition => ({
	type: 'mediaGroup',
	content,
});
