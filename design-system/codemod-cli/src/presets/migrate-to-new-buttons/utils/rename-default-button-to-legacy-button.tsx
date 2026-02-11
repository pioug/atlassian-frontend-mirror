import type { API, Collection, ImportDeclaration, JSXElement } from 'jscodeshift';

import { entryPointsMapping } from '../utils/constants';

export const renameDefaultButtonToLegacyButtonImport: (oldButtonImport: Collection<ImportDeclaration>, oldButtonElements: Collection<JSXElement>, j: API["jscodeshift"]) => void = (
	oldButtonImport: Collection<ImportDeclaration>,
	oldButtonElements: Collection<JSXElement>,
	j: API['jscodeshift'],
) => {
	oldButtonImport.insertBefore(
		j.importDeclaration(
			[j.importDefaultSpecifier(j.identifier('LegacyButton'))],
			j.stringLiteral(entryPointsMapping.Button),
		),
	);

	oldButtonElements.forEach((element) => {
		const legacyElement = j.jsxElement(
			j.jsxOpeningElement(
				j.jsxIdentifier('LegacyButton'),
				element.value.openingElement.attributes,
				element.value.children?.length === 0,
			),
			element.value.children?.length === 0
				? null
				: j.jsxClosingElement(j.jsxIdentifier('LegacyButton')),
			element.value.children,
		);
		j(element).replaceWith(legacyElement);
	});
};
