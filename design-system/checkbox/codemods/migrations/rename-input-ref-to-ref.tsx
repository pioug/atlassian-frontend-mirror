import { createRenameFuncFor } from '../utils';

export const renameInputRef: (j: import("jscodeshift/src/core").JSCodeshift, source: import("jscodeshift/src/Collection").Collection<Node>) => void = createRenameFuncFor(
	'@atlaskit/checkbox',
	'Checkbox',
	'inputRef',
	'ref',
);
