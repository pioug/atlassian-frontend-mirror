import type { CaptionDefinition } from '@atlaskit/adf-schema/caption';

export const caption = (...content: CaptionDefinition['content']): CaptionDefinition => ({
	type: 'caption',
	content,
});
