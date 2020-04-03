import { StatusDefinition } from '@atlaskit/adf-schema';

export const status = (
  attrs: StatusDefinition['attrs'] = {
    text: 'In progress',
    color: 'blue',
  },
): StatusDefinition => ({
  type: 'status',
  attrs,
});
