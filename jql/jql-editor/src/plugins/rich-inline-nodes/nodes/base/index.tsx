import React from 'react';

import { cssMap, cx } from '@atlaskit/css';
import LockLockedIcon from '@atlaskit/icon/core/lock-locked';
import { Box, Inline, Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { NodeViewProps } from '../../util/react-node-view';

import { type NodeBaseProps } from './types';

const styles = cssMap({
	nodeWrapper: {
		display: 'flex',
		alignItems: 'center',
		border: `${token('border.width')} solid transparent`,
		borderRadius: token('radius.small'),
		backgroundColor: token('color.background.neutral'),
		height: '20px',
		paddingBlock: '0',
		paddingInlineStart: token('space.025'),
		paddingInlineEnd: token('space.050'),

		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered'),
		},
	},

	nodeWrapperSelected: {
		backgroundColor: token('color.background.selected'),
		borderColor: token('color.border.selected'),

		'&:hover': {
			backgroundColor: token('color.background.selected.hovered'),
		},
	},

	nodeWrapperError: {
		textDecoration: 'wavy underline',
		textDecorationThickness: '1px',
		textDecorationSkipInk: 'none',
		textDecorationColor: token('color.text.danger'),
	},

	nodeWrapperErrorSelected: {
		backgroundColor: token('color.background.danger'),

		'&:hover': {
			backgroundColor: token('color.background.danger.hovered'),
		},
	},

	textWrapper: {
		fontFamily: token('font.family.code'),
	},

	iconBeforeWrapper: {
		display: 'flex',
		height: '16px',
		alignItems: 'center',
		marginBlockStart: token('space.negative.025'),
	},

	iconAfterWrapper: {},
});

/**
 * NodeBase Component
 *
 * This component is a base component for rendering a pill-like view for different node types.
 * It is designed to be used in the JQL editor to provide a consistent UI for various entities
 * such as projects, teams, users, etc.
 *
 * Currently, this component is only implemented for the "Project" (Atlas) node type. Separate components
 * already exist for "User" and "Team" nodes. However, to ensure consistency in design, these
 * components should eventually be refactored to use this base component. This will help maintain
 * a uniform look and feel across different node types.
 */

export const NodeBase = (props: NodeViewProps<NodeBaseProps>) => {
	const { iconBefore, text, isLocked, selected, error } = props;

	return (
		<Pressable
			xcss={cx(
				styles.nodeWrapper,
				error && styles.nodeWrapperError,
				selected && (error ? styles.nodeWrapperErrorSelected : styles.nodeWrapperSelected),
			)}
		>
			<Inline space="space.050" alignBlock="center">
				{iconBefore && <Box xcss={styles.iconBeforeWrapper}>{iconBefore}</Box>}
				<Box xcss={styles.textWrapper}>{text}</Box>
				{isLocked && (
					<Box xcss={styles.iconAfterWrapper}>
						<LockLockedIcon size="small" color={token('color.icon.accent.red')} label="" />
					</Box>
				)}
			</Inline>
		</Pressable>
	);
};
