import { createRenameFuncFor } from '../utils';

export const migrateRadioAriaLabelledby = createRenameFuncFor(
	'@atlaskit/radio',
	'Radio',
	'aria-labelledby',
	'labelId',
);

export const migrateRadioGroupAriaLabelledby = createRenameFuncFor(
	'@atlaskit/radio',
	'RadioGroup',
	'aria-labelledby',
	'labelId',
);
