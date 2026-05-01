import { type ImportDeclaration } from 'eslint-codemod-utils';

import { hasImportOfName } from './has-import-of-name';

export const getUniqueButtonItemName: (
	menuNode: ImportDeclaration | null,
	importDeclarations: ImportDeclaration[],
) => string = (
	menuNode: ImportDeclaration | null,
	importDeclarations: ImportDeclaration[],
): string => {
	// Remove menu import node from array
	const allImportDeclarationsButMenu = importDeclarations.filter((i) => i !== menuNode);

	let currentButtonItemNameExistsOtherThanMenu: boolean = allImportDeclarationsButMenu.reduce(
		(acc, importNode) => acc || hasImportOfName(importNode, 'ButtonItem'),
		false,
	);

	if (currentButtonItemNameExistsOtherThanMenu) {
		let suffix = 1;

		while (currentButtonItemNameExistsOtherThanMenu) {
			suffix += 1;
			currentButtonItemNameExistsOtherThanMenu = allImportDeclarationsButMenu.reduce(
				(acc, importNode) => acc || hasImportOfName(importNode, `ButtonItem${suffix}`),
				false,
			);
		}

		return `ButtonItem${suffix}`;
	} else {
		return 'ButtonItem';
	}
};
