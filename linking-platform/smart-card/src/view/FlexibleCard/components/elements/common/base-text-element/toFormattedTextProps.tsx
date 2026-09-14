/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { MessageDescriptor } from 'react-intl';

import type { BaseTextElementProps } from './BaseTextElement';

export const toFormattedTextProps = (
	descriptor: MessageDescriptor,
	context?: string,
): Partial<BaseTextElementProps> | undefined => {
	return context ? { message: { descriptor, values: { context } }, content: context } : undefined;
};
