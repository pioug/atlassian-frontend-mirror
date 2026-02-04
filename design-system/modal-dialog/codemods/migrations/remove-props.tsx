import { createRemoveFuncIfBooleanFor } from '../utils';

export const removeAutoFocus: (
	j: import('jscodeshift/src/core').JSCodeshift,
	source: import('jscodeshift/src/Collection').Collection<Node>,
) => void = createRemoveFuncIfBooleanFor('@atlaskit/modal-dialog', 'ModalDialog', 'autoFocus');
