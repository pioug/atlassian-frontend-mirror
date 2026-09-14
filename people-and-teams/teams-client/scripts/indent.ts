import { SINGLE_INDENT } from './utils';

export function indent(level: number): string {
	return SINGLE_INDENT.repeat(level);
}
