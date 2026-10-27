import type {
	RegisterMenuItem,
	RegisterMenuSection,
} from '@atlaskit/editor-ui-control-model/types';

import type { RegisteredMenuModel } from './types';

export type RegisteredMenuRow = RegisterMenuItem | RegisterMenuSection;

export const getRegisteredMenuRows = (model: RegisteredMenuModel): RegisteredMenuRow[] => [
	...model.sections.flat(),
	...model.fallbackItems,
];
