import { token } from '@atlaskit/tokens';

/**
 * Ideally these are exported by @atlaskit/page
 */
export const spacing = {
  comfortable: token('spacing.scale.500', '40px'),
  cosy: token('spacing.scale.200', '16px'),
  compact: token('spacing.scale.050', '4px'),
} as const;

export type Spacing = keyof typeof spacing;
