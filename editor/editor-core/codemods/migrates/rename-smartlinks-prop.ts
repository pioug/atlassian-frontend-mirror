import type core from 'jscodeshift';
import type { Collection } from 'jscodeshift/src/Collection';

import { createJSXRenameVariableToNestedKeyTransform } from './createJSXRenameVariableToNestedKeyTransform';

export const renameSmartLinksProp: (j: core.JSCodeshift, source: Collection<unknown>) => void =
	createJSXRenameVariableToNestedKeyTransform('smartLinks', 'linking', 'smartLinks');
