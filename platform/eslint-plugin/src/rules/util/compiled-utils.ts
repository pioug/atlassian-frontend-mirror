import type { Node } from 'estree';
import { getAncestors, getScope } from './context-compat';
import type { Rule } from 'eslint';
import {
	getImportSources,
	isCompiled,
	isAtlasKitCSS,
} from '@atlaskit/eslint-utils/is-supported-import';

// Checks if the function that holds the property is using a Compiled import package that this rule is targeting
export const isCompiledAPI = (context: Rule.RuleContext, node: Node): boolean => {
	const importSources = getImportSources(context);
	const { references } = getScope(context, node);
	const ancestors = getAncestors(context, node);
	if (
		ancestors.some(
			(ancestor) =>
				ancestor.type === 'CallExpression' &&
				ancestor.callee &&
				(isCompiled(ancestor.callee, references, importSources) ||
					isAtlasKitCSS(ancestor.callee, references, importSources)),
		)
	) {
		return true;
	}
	return false;
};
