import type { StatusDefinition } from '@atlaskit/adf-schema/status';

export const status = (
	attrs: StatusDefinition['attrs'] = {
		text: 'In progress',
		color: 'blue',
	},
): StatusDefinition => ({
	type: 'status',
	attrs,
});
