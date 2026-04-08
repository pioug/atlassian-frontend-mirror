import { createRenameFuncFor } from '../create-rename-func-for';

export const migrateRadioAriaLabelledby: (
	j: import('jscodeshift/src/core').JSCodeshift,
	source: import('jscodeshift/src/Collection').Collection<Node>,
) => void = createRenameFuncFor('@atlaskit/radio', 'Radio', 'aria-labelledby', 'labelId');
