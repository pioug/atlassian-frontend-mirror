/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

const badgeStyles = cssMap({
	base: {
		borderRadius: token('radius.small'),
		height: '20px',
		display: 'inline-flex',
		alignItems: 'center',
		width: 'fit-content',
		flexGrow: 0,
		paddingInline: token('space.050'),
		paddingBlock: token('space.025'),
		gap: token('space.100'),
	},
	label: {
		backgroundColor: token('color.background.accent.blue.subtlest'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		// @ts-ignore border color is not a valid border token
		borderColor: token('color.background.accent.blue.subtlest.hovered'),
	},
	tag: {
		backgroundColor: token('color.background.neutral'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border'),
	},
	metric: {
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.xsmall'),
		height: '16px',
		minHeight: '16px',
		minWidth: '24px',
		justifyContent: 'center',
		paddingInline: token('space.100'),
	},
	date: {
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.050'),
		backgroundColor: token('color.background.neutral'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border'),
	},
	badgeText: {
		font: token('font.code'),
		color: token('color.text.subtle'),
		textAlign: 'center',
	},
});

export interface BadgeProps {
	variant: 'label' | 'tag' | 'date' | 'metric';
	children: React.ReactNode;
	icon?: React.ReactNode;
}

export const Badge = ({ variant, children, icon }: BadgeProps): JSX.Element => {
	if (variant === 'metric') {
		return (
			<Box xcss={cx(badgeStyles.base, badgeStyles.metric)}>
				<Box as="p" xcss={badgeStyles.badgeText}>
					{children}
				</Box>
			</Box>
		);
	}

	return (
		<Box xcss={cx(badgeStyles.base, badgeStyles[variant])}>
			{icon && icon}
			<Text size="small">{children}</Text>
		</Box>
	);
};
