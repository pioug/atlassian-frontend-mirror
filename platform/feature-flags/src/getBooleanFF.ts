import { resolveBooleanFlag } from './resolveBooleanFlag';

export function getBooleanFF(name: string): boolean {
	return resolveBooleanFlag(name);
}
