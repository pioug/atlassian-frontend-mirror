/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { BaseDateTimeElementProps } from './index';

export const toDateTimeProps = (
	type: 'created' | 'modified' | 'sent',
	dateString?: string,
): Partial<BaseDateTimeElementProps> | undefined => {
	return dateString ? { date: new Date(dateString), type } : undefined;
};
