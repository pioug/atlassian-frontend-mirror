import type { JQLNodeSpec } from '../types';
import { FocusAreaNode } from './focus-area-node';
import type { Props } from './types';

export const focusArea: JQLNodeSpec<Props> = {
	component: FocusAreaNode,
	attrs: {
		id: {},
		name: {},
		fieldName: {},
	},
};
