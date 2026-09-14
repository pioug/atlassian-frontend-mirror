import type { DateDefinition } from '@atlaskit/adf-schema/date';

export const date = (attrs: DateDefinition['attrs'] = { timestamp: '' }): DateDefinition => ({
	type: 'date',
	attrs,
});
