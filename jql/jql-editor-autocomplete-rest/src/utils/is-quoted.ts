import { isDoubleQuoted } from './is-double-quoted';
import { isSingleQuoted } from './is-single-quoted';

export const isQuoted = (maybeQuotedString: string): boolean =>
	isSingleQuoted(maybeQuotedString) || isDoubleQuoted(maybeQuotedString);
