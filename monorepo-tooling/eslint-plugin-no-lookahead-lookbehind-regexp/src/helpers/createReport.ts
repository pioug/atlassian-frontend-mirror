import { type Rule } from 'eslint';
import type * as ESTree from 'estree';

import {
	type AnalyzeOptions,
	type analyzeRegExpForLookaheadAndLookbehind,
} from '../helpers/analyzeRegExpForLookaheadAndLookbehind';
import { type collectUnsupportedTargets, formatLinterMessage } from '../helpers/caniuse';

type NodeToReport =
	| (ESTree.Literal & Rule.NodeParentExtension)
	| (ESTree.TemplateLiteral & Rule.NodeParentExtension);

export function createContextReport(
	node: NodeToReport,
	context: Rule.RuleContext,
	violators: ReturnType<typeof analyzeRegExpForLookaheadAndLookbehind>,
	targets: ReturnType<typeof collectUnsupportedTargets>,
	config: AnalyzeOptions['config'],
): void {
	context.report({
		node: node,
		message: formatLinterMessage(violators, targets, config),
	});
}
