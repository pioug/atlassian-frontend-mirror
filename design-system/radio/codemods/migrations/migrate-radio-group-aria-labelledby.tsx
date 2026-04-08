import { createRenameFuncFor } from '../create-rename-func-for';

export const migrateRadioGroupAriaLabelledby: (
	j: import('jscodeshift/src/core').JSCodeshift,
	source: import('jscodeshift/src/Collection').Collection<Node>,
) => void = createRenameFuncFor('@atlaskit/radio', 'RadioGroup', 'aria-labelledby', 'labelId');
