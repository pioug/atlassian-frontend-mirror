import { resolveBooleanFlag } from './resolveBooleanFlag';

export function fg(name: string): boolean {
	return resolveBooleanFlag(name);
}
