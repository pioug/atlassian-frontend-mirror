import { HardBreakDefinition } from '@atlaskit/adf-schema';

export const hardBreak = (
  attrs?: HardBreakDefinition['attrs'],
): HardBreakDefinition => ({
  type: 'hardBreak',
  attrs,
});
