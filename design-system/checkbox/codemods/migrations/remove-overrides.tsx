import { createRemoveFuncFor } from '../utils/create-remove-func-for';

export const removeOverrides: (
	j: import('jscodeshift/src/core').JSCodeshift,
	source: import('jscodeshift/src/Collection').Collection<Node>,
) => void = createRemoveFuncFor(
	'@atlaskit/checkbox',
	'Checkbox',
	'overrides',
	`This file uses the @atlaskit/checkbox \`overrides\` prop
  which has now been removed due to its poor performance characteristics. We have not
  replaced overrides with an equivalent API and the overrides pattern exposes internal
  implementation detail as public API and makes it harder for you to upgrade. The appearance
  of Checkbox will have likely changed.`,
);
