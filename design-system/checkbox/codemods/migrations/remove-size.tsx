import { createRemoveFuncFor } from '../utils/create-remove-func-for';

export const removeSize: (
	j: import('jscodeshift/src/core').JSCodeshift,
	source: import('jscodeshift/src/Collection').Collection<Node>,
) => void = createRemoveFuncFor('@atlaskit/checkbox', 'Checkbox', 'size');
