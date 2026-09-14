import { type JQLNodeSpec } from '../types';

import { TeamNode } from './team-node';
import type { Props } from './types';

export const team: JQLNodeSpec<Props> = {
	component: TeamNode,
	attrs: {
		id: {},
		name: {},
		fieldName: {},
	},
};
