import type {
	MediaInlineDefinition,
	MediaInlineAttributes,
} from '@atlaskit/adf-schema/media-inline';

export const mediaInline = (attrs: MediaInlineAttributes): MediaInlineDefinition => ({
	type: 'mediaInline',
	attrs,
});
