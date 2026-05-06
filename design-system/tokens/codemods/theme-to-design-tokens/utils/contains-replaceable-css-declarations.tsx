import { isColorRelatedProperty } from '../../css-to-design-tokens/lib/declaration';

export function containsReplaceableCSSDeclarations(input: string): boolean {
	const cssPattern = /(\S+)\s*:/g;

	let match;
	while ((match = cssPattern.exec(input)) !== null) {
		if (isColorRelatedProperty(match[1])) {
			return true;
		}
	}
	return false;
}
