/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { BaseTextElementProps } from './BaseTextElement';

export const toTextProps = (content?: string): Partial<BaseTextElementProps> | undefined => {
	return content ? { content } : undefined;
};
