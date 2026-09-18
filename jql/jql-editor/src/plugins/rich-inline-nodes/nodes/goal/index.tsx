import type { JQLNodeSpec } from '../types';
import { GoalNode } from './goal-node';
import type { Props } from './types';

export const goal: JQLNodeSpec<Props> = {
	component: GoalNode,
	attrs: {
		id: {},
		name: {},
		fieldName: {},
	},
};
