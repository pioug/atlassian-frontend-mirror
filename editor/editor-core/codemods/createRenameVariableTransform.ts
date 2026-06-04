import type { default as core } from 'jscodeshift';
import type { Collection } from 'jscodeshift/src/Collection';

/**
 * Renames a variable with the given name.
 *
 * @param from String
 * @param toName String
 */
export const createRenameVariableTransform = (from: string, toName: string) => {
	return (j: core.JSCodeshift, source: Collection<unknown>): void => {
		source.find(j.Identifier, { name: from }).forEach((x) => {
			// eslint-disable-next-line @atlassian/perf-linting/no-expensive-split-replace -- Ignored via go/ees017 (to be fixed)
			x.replace(j.identifier(toName));
		});
	};
};
