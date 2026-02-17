import type { JQLNodeSpec } from '../types';

import { ProjectNode } from './project-node';
import type { Props } from './types';

export const project: JQLNodeSpec<Props> = {
	component: ProjectNode,
	attrs: {
		id: {},
		name: {},
		fieldName: {},
	},
};
