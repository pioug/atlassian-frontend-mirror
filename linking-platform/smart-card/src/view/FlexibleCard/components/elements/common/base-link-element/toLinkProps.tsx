/* eslint-disable @compiled/shorthand-property-sorting */
/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { BaseLinkElementProps } from './index';

export const toLinkProps = (
	text?: string,
	url?: string,
): Partial<BaseLinkElementProps> | undefined => {
	return text ? { text, url } : undefined;
};
