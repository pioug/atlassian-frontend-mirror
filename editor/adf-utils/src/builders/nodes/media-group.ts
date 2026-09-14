import type { MediaGroupDefinition } from '@atlaskit/adf-schema/media-group';
import type { MediaDefinition } from '@atlaskit/adf-schema/media';

export const mediaGroup = (...content: Array<MediaDefinition>): MediaGroupDefinition => ({
	type: 'mediaGroup',
	content,
});
