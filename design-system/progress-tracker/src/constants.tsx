import { token } from '@atlaskit/tokens';

/**
 * Ideally these are exported by @atlaskit/page
 */
export const spacing = {
	comfortable: token('space.500', '40px'),
	cosy: token('space.200', '16px'),
	compact: token('space.050', '4px'),
} as const;

export type Spacing = keyof typeof spacing;
