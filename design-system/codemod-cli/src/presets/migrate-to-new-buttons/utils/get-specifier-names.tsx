import { type Collection, type Specifier } from 'jscodeshift';

/**
 * Returns a list of specifier names from the given specifiers.
 */
export default function getSpecifierNames(specifiers: Collection<Specifier>): string[] | undefined {
	return specifiers.length
		? specifiers.paths().map((path) => path.get().value.local.name as string)
		: undefined;
}
