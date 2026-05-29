import { extractCssVarName } from './declaration';
import { knownVariables } from './known-variables';

export function getCssVarMeta(cssVariable: string): string[] {
	const tokenName = extractCssVarName(cssVariable);
	const meta = knownVariables[tokenName];

	if (!meta || meta.length === 0) {
		return tokenName.split('-');
	}

	return meta;
}
