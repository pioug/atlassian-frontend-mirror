import type { CaptionDefinition } from '@atlaskit/adf-schema/caption';
import type { MediaDefinition } from '@atlaskit/adf-schema/media';
import type { MediaSingleDefinition } from '@atlaskit/adf-schema/media-single';
import type { ExtendedMediaAttributes as MediaSingleAttributes } from '@atlaskit/adf-schema/rich-media-common';

export const mediaSingle =
	(attrs: MediaSingleAttributes | undefined) =>
	(
		content: MediaDefinition | [MediaDefinition] | [MediaDefinition, CaptionDefinition],
	): MediaSingleDefinition => ({
		type: 'mediaSingle',
		attrs,
		content: Array.isArray(content) ? content : [content],
	});
