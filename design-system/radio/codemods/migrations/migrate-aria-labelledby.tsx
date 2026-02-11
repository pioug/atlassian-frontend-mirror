import { createRenameFuncFor } from '../utils';

export const migrateRadioAriaLabelledby: (j: import("jscodeshift/src/core").JSCodeshift, source: import("jscodeshift/src/Collection").Collection<Node>) => void = createRenameFuncFor(
	'@atlaskit/radio',
	'Radio',
	'aria-labelledby',
	'labelId',
);

export const migrateRadioGroupAriaLabelledby: (j: import("jscodeshift/src/core").JSCodeshift, source: import("jscodeshift/src/Collection").Collection<Node>) => void = createRenameFuncFor(
	'@atlaskit/radio',
	'RadioGroup',
	'aria-labelledby',
	'labelId',
);
