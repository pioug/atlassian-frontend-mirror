import { createRemoveImportsFor } from '../utils';

export const removeThemeImports: (j: import("jscodeshift/src/core").JSCodeshift, source: import("jscodeshift/src/Collection").Collection<Node>) => void = createRemoveImportsFor({
	importsToRemove: ['ComponentTokens', 'ThemeFn'],
	packagePath: '@atlaskit/checkbox/types',
	comment: `This file uses exports used to help theme @atlaskit/checkbox which
  has now been removed due to its poor performance characteristics. We have not replaced
  theme with an equivalent API due to minimal usage of the theming.
  The appearance of Checkbox will have likely changed.`,
});
