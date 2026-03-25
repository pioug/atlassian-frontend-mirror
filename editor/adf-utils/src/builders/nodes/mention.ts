import type { MentionDefinition, MentionAttributes } from '@atlaskit/adf-schema';

export const mention = (attrs: MentionAttributes): MentionDefinition => ({
	type: 'mention',
	attrs: { accessLevel: '', ...attrs },
});
