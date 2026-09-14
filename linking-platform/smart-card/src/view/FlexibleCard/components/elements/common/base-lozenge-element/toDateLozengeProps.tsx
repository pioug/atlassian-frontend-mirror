/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import { FormattedDate } from 'react-intl';

import type { BaseLozengeElementProps } from './index';

export const toDateLozengeProps = (
	dateString?: string,
): Partial<BaseLozengeElementProps> | undefined => {
	if (dateString) {
		const text = Date.parse(dateString) ? (
			<FormattedDate
				value={new Date(dateString)}
				year="numeric"
				month="short"
				day="numeric"
				formatMatcher="best fit"
			/>
		) : (
			dateString
		);
		return { text };
	}
};
