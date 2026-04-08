import { createRemoveFuncFor } from '../utils/create-remove-func-for';

export const removeFullWidth: (
	j: import('jscodeshift/src/core').JSCodeshift,
	source: import('jscodeshift/src/Collection').Collection<Node>,
) => void = createRemoveFuncFor('@atlaskit/checkbox', 'Checkbox', 'isFullWidth');
