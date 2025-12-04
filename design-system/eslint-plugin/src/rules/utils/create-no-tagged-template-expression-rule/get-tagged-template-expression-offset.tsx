// Original source from Compiled https://github.com/atlassian-labs/compiled/blob/master/packages/eslint-plugin/src/utils/create-no-tagged-template-expression-rule/get-tagged-template-expression-offset.ts
import type { Rule } from 'eslint';

type Node = Rule.Node;

export const getTaggedTemplateExpressionOffset = (node: Node): number => {
	const { parent } = node;
	// @ts-ignore - parent possibly null
	switch (parent.type || '') {
		case 'ExportDefaultDeclaration': {
			// @ts-ignore - parent possibly null
			return parent.loc!.start.column;
		}

		case 'VariableDeclarator': {
			// @ts-ignore - parent possibly null
			const maybeVariableDeclaration = parent.parent;
			// @ts-ignore - maybeVariableDeclaration possibly null
			if (maybeVariableDeclaration.type === 'VariableDeclaration') {
				// @ts-ignore - maybeVariableDeclaration possibly null
				const maybeExportNamedDeclaration = maybeVariableDeclaration.parent;
				// @ts-ignore - maybeExportNamedDeclaration possibly null
				if (maybeExportNamedDeclaration.type === 'ExportNamedDeclaration') {
					// @ts-ignore - maybeExportNamedDeclaration possibly null
					return maybeExportNamedDeclaration.loc!.start.column;
				} else {
					// @ts-ignore - maybeVariableDeclaration possibly null
					return maybeVariableDeclaration.loc!.start.column;
				}
			}
			break;
		}

		default:
			break;
	}

	return node.loc!.start.column;
};
