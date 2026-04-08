import { type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function tryCreateImport({
	j,
	base,
	relativeToPackage,
	packageName,
}: {
	j: JSCodeshift;
	base: Collection<any>;
	relativeToPackage: string;
	packageName: string;
}): void {
	const exists: boolean =
		base.find(j.ImportDeclaration).filter((path) => path.value.source.value === packageName)
			.length > 0;

	if (exists) {
		return;
	}

	base
		.find(j.ImportDeclaration)
		.filter((path) => path.value.source.value === relativeToPackage)
		.insertBefore(j.importDeclaration([], j.literal(packageName)));
}
