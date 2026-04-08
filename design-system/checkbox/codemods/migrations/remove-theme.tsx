import { createRemoveFuncFor } from '../utils/create-remove-func-for';

export const removeTheme: (
	j: import('jscodeshift/src/core').JSCodeshift,
	source: import('jscodeshift/src/Collection').Collection<Node>,
) => void = createRemoveFuncFor(
	'@atlaskit/checkbox',
	'Checkbox',
	'theme',
	`This file uses the @atlaskit/checkbox \`theme\` prop which
  has now been removed due to its poor performance characteristics. We have not replaced
  theme with an equivalent API due to minimal usage of the \`theme\` prop. However if you
  were using theme to customise the size of the checkbox there is now a \`size\` prop.
  The appearance of Checkbox will have likely changed.`,
);
