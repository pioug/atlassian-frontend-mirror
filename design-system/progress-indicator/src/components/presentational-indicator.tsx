/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, cx, jsx } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { DotsAppearance } from './types';

const commonStyles: any = cssMap({
	common: {
		width: `var(--ds-dots-size)`,
		height: `var(--ds-dots-size)`,
		position: 'relative',
		borderRadius: token('radius.full'),

		'&::before': {
			display: 'block',
			width: `calc(var(--ds-dots-size) + var(--ds-dots-margin))`,
			height: `calc(var(--ds-dots-size) + var(--ds-dots-margin))`,
			position: 'absolute',
			content: '""',
			insetBlockStart: `calc(-1 * var(--ds-dots-margin) / 2)`,
			insetInlineStart: `calc(-1 * var(--ds-dots-margin) / 2)`,
		},
	},
});
const colorBorderMap = cssMap({
	default: {
		border: `${token('border.width')} solid ${token('color.border.bold')}`,
	},
	help: {
		border: `${token('border.width')} solid ${token('color.border.bold')}`,
	},
	inverted: {
		border: `${token('border.width')} solid ${token('color.border.inverse')}`,
	},
	primary: {
		border: `${token('border.width')} solid ${token('color.border.bold')}`,
	},
});
const backgroundColor = (isSelected: boolean) => {
	if (!isSelected) {
		return {
			default: token('elevation.surface'),
			help: token('elevation.surface'),
			inverted: token('color.background.neutral.subtle'),
			primary: token('elevation.surface'),
		} as const;
	}
	return {
		default: token('color.icon'),
		help: token('color.icon.discovery'),
		inverted: token('color.icon.inverse'),
		primary: token('color.icon.brand'),
	} as const;
};

type PresentationalIndicatorProps = {
	appearance: DotsAppearance;
	isSelected: boolean;
	testId?: string;
};

export const PresentationalIndicator: ({
	appearance,
	isSelected,
	testId,
}: PresentationalIndicatorProps) => JSX.Element = ({
	appearance,
	isSelected,
	testId,
}: PresentationalIndicatorProps) => {
	return (
		<Box
			testId={testId}
			// here we set it dynamic because that backgroundColor and xcss don't support the colors we need here eg. token('color.icon')
			style={{ backgroundColor: backgroundColor(isSelected)[appearance] }}
			xcss={cx(commonStyles.common, colorBorderMap[appearance])}
		/>
	);
};
