import type { JQLNodeSpec } from '../types';

import { AssetsNode } from './assets-node';
import type { Props } from './types';

export const assets: JQLNodeSpec<Props> = {
	component: AssetsNode,
	attrs: {
		id: {},
		name: {},
		fieldName: {},
	},
};
