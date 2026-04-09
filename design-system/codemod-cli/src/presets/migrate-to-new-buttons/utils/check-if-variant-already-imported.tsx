import type { API, Collection } from 'jscodeshift';

import { findVariantAlreadyImported } from './find-variant-already-imported';

export const checkIfVariantAlreadyImported = (
	variant: string,
	entryPoint: string,
	fileSource: Collection<any>,
	j: API['jscodeshift'],
	isDefaultSpecifier: boolean = false,
): boolean => {
	return (
		findVariantAlreadyImported(variant, entryPoint, fileSource, j, isDefaultSpecifier).length > 0
	);
};
