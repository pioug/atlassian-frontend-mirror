import { knownVariables } from './known-variables';

export function isKnownCssVariable(value: string): boolean {
	return value in knownVariables;
}
