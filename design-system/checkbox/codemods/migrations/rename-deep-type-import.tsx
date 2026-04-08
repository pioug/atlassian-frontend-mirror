import { createRenameImportFor } from '../utils/create-rename-import-for';

export const renameDeepTypeImport: (
	j: import('jscodeshift/src/core').JSCodeshift,
	source: import('jscodeshift/src/Collection').Collection<Node>,
) => void = createRenameImportFor({
	componentName: 'CheckboxProps',
	oldPackagePath: '@atlaskit/checkbox/dist/cjs/types',
	newPackagePath: '@atlaskit/checkbox',
});
