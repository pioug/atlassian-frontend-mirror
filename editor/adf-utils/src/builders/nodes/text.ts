import { TextDefinition } from '@atlaskit/adf-schema';

export const text = (text: string): TextDefinition => ({
  type: 'text',
  text,
});
