// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule, SourceCode } from 'eslint';
import { closestOfType } from 'eslint-codemod-utils';

import { getImportedNodeBySource } from '../utils/get-import-node-by-source';

import {
  IMPORT_NAME,
  VISUALLY_HIDDEN_IMPORT,
  VISUALLY_HIDDEN_SOURCE,
} from './constants';
import { getFirstImport } from './utils';

export default (source: SourceCode, node: Rule.Node) =>
  (fixer: Rule.RuleFixer) => {
    const fixes = [];
    const importedNode = getFirstImport(source);
    const visuallyHiddenNode = getImportedNodeBySource(
      source,
      VISUALLY_HIDDEN_SOURCE,
    );

    if (!importedNode) {
      return [];
    }

    const jsxOpeningElement = closestOfType(node, 'JSXOpeningElement')!;

    if (visuallyHiddenNode) {
      fixes.push(
        fixer.replaceText(
          jsxOpeningElement,
          visuallyHiddenNode.specifiers[0].local.name,
        ),
      );
    } else {
      fixes.push(fixer.insertTextBefore(importedNode, VISUALLY_HIDDEN_IMPORT));
      fixes.push(fixer.replaceText(jsxOpeningElement, `<${IMPORT_NAME} />`));
    }

    return fixes;
  };
