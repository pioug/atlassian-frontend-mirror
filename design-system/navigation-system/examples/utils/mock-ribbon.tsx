/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import {
	ConfluenceIcon,
	CustomerServiceManagementIcon,
	JiraIcon,
	type LogoProps,
	LoomIcon,
} from '@atlaskit/logo';
import { Pressable, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const ribbonStyles = cssMap({
	root: {
		width: '4rem',
		boxSizing: 'border-box',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: token('elevation.surface.sunken'),
		height: '100%',
		paddingBlockStart: token('space.075'),
		paddingInlineEnd: token('space.075'),
		paddingBlockEnd: token('space.075'),
		paddingInlineStart: token('space.075'),
	},
});

const ribbonItemStyles = cssMap({
	root: {
		display: 'grid',
		gridTemplateRows: 'auto auto',
		gap: token('space.075'),
		borderRadius: token('radius.medium'),
		backgroundColor: token('color.background.neutral.subtle'),
		position: 'relative',
		justifyItems: 'center',
		paddingBlock: token('space.075'),
		'&:hover': {
			// @ts-expect-error
			'--overlay': token('color.interaction.hovered'),
		},
		'&:active': {
			// @ts-expect-error
			'--overlay': token('color.interaction.pressed'),
		},
		'&:focus-visible': {
			outline: 'none',
			// @ts-expect-error
			'--outline-color': token('color.border.focused'),
		},
	},
	logo: {
		display: 'flex',
		width: '2rem',
		height: '2rem',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		'&::before': {
			content: '""',
			position: 'absolute',
			inset: 0,
			backgroundColor: 'var(--overlay)',
			borderRadius: token('radius.large'),
			outline: '2px solid var(--outline-color, transparent)',
			outlineOffset: token('space.025'),
		},
	},
	active: {
		'&::before': {
			content: '""',
			position: 'absolute',
			width: '4px',
			height: '32px',
			insetBlockStart: token('space.075'),
			insetInlineStart: token('space.negative.075'),
			backgroundColor: token('color.background.selected.bold'),
			borderStartEndRadius: token('radius.medium'),
			borderEndEndRadius: token('radius.medium'),
		},
	},
});

const RibbonItem = ({
	children,
	logo: Logo,
	isActive = false,
}: {
	children: React.ReactNode;
	logo: React.ComponentType<LogoProps>;
	isActive?: boolean;
}) => {
	return (
		// @ts-expect-error - type error when using CSS vars inside pseudo selectors
		// eslint-disable-next-line @compiled/no-suppress-xcss
		<Pressable xcss={cx(ribbonItemStyles.root, isActive && ribbonItemStyles.active)}>
			<div css={ribbonItemStyles.logo}>
				<Logo appearance={isActive ? 'brand' : 'neutral'} size="medium" shouldUseNewLogoDesign />
			</div>
			<Text size="small" weight="medium" color="color.text.subtle" maxLines={1}>
				{children}
			</Text>
		</Pressable>
	);
};

export function MockRibbon() {
	return (
		<div css={ribbonStyles.root}>
			<RibbonItem logo={JiraIcon}>Jira</RibbonItem>
			<RibbonItem logo={ConfluenceIcon}>Confluence</RibbonItem>
			<RibbonItem isActive logo={CustomerServiceManagementIcon}>
				Customer Service Management
			</RibbonItem>
			<RibbonItem logo={LoomIcon}>Loom</RibbonItem>
		</div>
	);
}
