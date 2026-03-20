import type { JSCodeshift } from 'jscodeshift';
import type { Collection } from 'jscodeshift/src/Collection';

import { createRenameVariableTransform } from '../utils';

export const renameUnsafeCardProp: (j: JSCodeshift, source: Collection<unknown>) => void =
	createRenameVariableTransform('UNSAFE_cards', 'smartLinks');
