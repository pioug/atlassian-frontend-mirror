import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

import { useHydratedGoal } from '../../../../state';
import type { NodeViewProps } from '../../util/react-node-view';
import { NodeBase } from '../base';

import { GoalIcon, type GoalIconKey, isGoalIconKey } from './goal-icon';
import type { Props } from './types';

const styles = cssMap({
	iconWrapper: {
		display: 'flex',
		height: '16px',
		position: 'relative',
	},
});

function toGoalIconKey(iconKey: string | null | undefined): GoalIconKey {
	return iconKey && isGoalIconKey(iconKey) ? iconKey : 'GOAL';
}

/**
 * GoalNode Component
 *
 * This component is a component for rendering a pill-like view for Goal node type
 * in the JQL editor
 */
export const GoalNode = (props: NodeViewProps<Props>): React.JSX.Element => {
	const { id, fieldName, name, ...rest } = props;

	const [goal] = useHydratedGoal({
		id,
		fieldName,
	});

	return (
		<NodeBase
			iconBefore={
				<Box xcss={styles.iconWrapper}>
					<GoalIcon size="16" status={goal?.status ?? 'DEFAULT'} iconKey={toGoalIconKey('GOAL')} />
				</Box>
			}
			text={name}
			isRichNodeDisplay
			{...rest}
		/>
	);
};
