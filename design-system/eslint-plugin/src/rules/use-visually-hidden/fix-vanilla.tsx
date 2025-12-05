import type { Rule, SourceCode } from 'eslint';

import { getImportedNodeBySource } from '../utils/get-import-node-by-source';

import { IMPORT_NAME, VISUALLY_HIDDEN_IMPORT, VISUALLY_HIDDEN_SOURCE } from './constants';
import { getFirstImport } from './utils';

const fixVanilla = (source: SourceCode, node: Rule.Node) => (fixer: Rule.RuleFixer) => {
	const fixes = [];
	const importedNode = getFirstImport(source);
	const visuallyHiddenNode = getImportedNodeBySource(source, VISUALLY_HIDDEN_SOURCE);

	if (!importedNode) {
		return [];
	}

	if (visuallyHiddenNode) {
		fixes.push(fixer.replaceText(node, visuallyHiddenNode.specifiers[0].local.name));
	} else {
		fixes.push(fixer.insertTextBefore(importedNode, VISUALLY_HIDDEN_IMPORT));
		fixes.push(fixer.replaceText(node, IMPORT_NAME));
	}

	return fixes;
};

export default fixVanilla;
