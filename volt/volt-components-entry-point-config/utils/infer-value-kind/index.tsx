import type { EntryPointConfig } from '../../src/types';

export function inferValueKind(name: string): EntryPointConfig[string][string][string]['type'] {
	if (name === 'default') {
		return 'component';
	}
	if (/^[A-Z0-9_]+$/.test(name)) {
		return 'value';
	}
	if (/^[A-Z]/.test(name)) {
		return 'component';
	}
	return 'value';
}
