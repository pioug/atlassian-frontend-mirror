import type { Rule } from 'eslint';

import { getIsException } from '../utils/get-is-exception';
import { isChildOfType } from '../utils/is-child-of-type';
import { isDecendantOfGlobalToken } from '../utils/is-decendant-of-global-token';
import { isDecendantOfStyleBlock } from '../utils/is-decendant-of-style-block';
import { isLegacyElevation } from '../utils/is-elevation';
import { isLegacyColor } from '../utils/is-legacy-color';
import { isLegacyNamedColor } from '../utils/is-legacy-named-color';

import { getElevationTokenExample } from './get-elevation-token-example';
import { getTokenSuggestion } from './get-token-suggestion';
import type { RuleConfig } from './types';

const getNodeColumn = (node: Rule.Node) => (node.loc ? node.loc.start.column : 0);

// TemplateLiteral > Identifier
export const lintTemplateIdentifierForColor = (
	node: Rule.Node,
	context: Rule.RuleContext,
	config: RuleConfig,
): void => {
	if (node.type !== 'Identifier') {
		return;
	}

	if (isDecendantOfGlobalToken(node) || !isDecendantOfStyleBlock(node)) {
		return;
	}

	const elevation = isLegacyElevation(node.name);

	if (elevation) {
		context.report({
			messageId: 'legacyElevation',
			node,
			data: {
				example: getElevationTokenExample(elevation),
			},
			fix: (fixer) => {
				if (isChildOfType(node, 'TemplateLiteral') && node.range) {
					return fixer.replaceTextRange(
						[node.range[0] - 2, node.range[1] + 1],
						`background-color: \${token('${elevation.background}')};
${' '.repeat(getNodeColumn(node) - 2)}box-shadow: \${token('${elevation.shadow}')}`,
					);
				}

				return null;
			},
		});
	}

	const isException = getIsException(config.exceptions);

	if (isLegacyColor(node.name) || (isLegacyNamedColor(node.name) && !isException(node))) {
		context.report({
			messageId: 'hardCodedColor',
			node,
			suggest: getTokenSuggestion(node, node.name, config),
		});
		return;
	}
};
