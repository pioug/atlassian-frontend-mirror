import type { Rule } from 'eslint';
import { isAPIimport, type Node } from '../utils';

const isAndExpression = (node: Rule.Node): node is Node<'LogicalExpression'> =>
	node.type === 'LogicalExpression' && node.operator === '&&';

const isExpUsage = (calleeName: string) => calleeName === 'expVal' || calleeName === 'expValEquals';

const getGateType = (node: Rule.Node, context: Rule.RuleContext): string => {
	const { type } = node;

	if (type === 'BinaryExpression') {
		return (
			getGateType(node.left as Node<'BinaryExpression'>, context) ||
			getGateType(node.right as Node<'BinaryExpression'>, context)
		);
	}

	if (type === 'AwaitExpression') {
		return getGateType((node as Node<'AwaitExpression'>).argument as Rule.Node, context);
	}

	if (node.type === 'CallExpression') {
		const { callee } = node;

		const isFeatureGate =
			type === 'CallExpression' &&
			callee.type === 'Identifier' &&
			// Experiments cannot have other experiments as preconditions, only gates
			(callee.name === 'fg' || isExpUsage(callee.name)) &&
			isAPIimport(callee.name, context, node);

		return isFeatureGate ? callee.name : '';
	}

	return '';
};

const getPreconditionStatus = (
	logicalExpression: Node<'LogicalExpression'>,
	context: Rule.RuleContext,
) => {
	const { left } = logicalExpression as any;
	// If left side is a nested AND expression then the left side node is on the nested's right
	const leftGateType = getGateType(isAndExpression(left) ? left.right : left, context);

	if (leftGateType) {
		const rightGateType = getGateType(logicalExpression.right as any, context);
		// Check this scenario: fg('gate') && isAdmin
		if (!rightGateType) {
			return 'early-exposure';
		}

		// Using experiment values in logical expressions in valid
		// i.e. expVal() && expVal()
		if (isExpUsage(leftGateType) && isExpUsage(rightGateType)) {
			return '';
		}

		// Then is scenario: fg('gate1') && fg('gate2')
		return 'unnecessary-gate';
	}

	return '';
};

const rule: Rule.RuleModule = {
	meta: {
		docs: {
			description: 'Inform on how to use gates and experiments in logical expressions',
			url: 'https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/browse/platform/packages/platform/eslint-plugin/src/rules/no-preconditioning/README.md',
		},
		messages: {
			useConfig:
				'Do not precondition gates or experiments with another gate. Configure this in Statsig instead to reduce unnecessary code, simplify cleanup and to ensure accurate exposures in Statsig.',
			incorrectExposure:
				'Evaluate gates or experiments at the end of your logical expression to ensure exposure is tracked correctly.',
		},
	},
	create(context) {
		return {
			'LogicalExpression[operator="&&"]': (node: Node<'LogicalExpression'>) => {
				const { parent } = node;
				// Don't analyze nested AND logical expressions
				if (isAndExpression(parent)) {
					return;
				}

				const isAssignmentStatement =
					parent.type !== 'IfStatement' &&
					parent.type !== 'ConditionalExpression' &&
					// @ts-expect-error — this isn't a valid statement but does fail tests when removed.
					// When updating this rule please resolve this supression.
					!(parent.type === 'LogicalExpression' && parent.operator === '||');

				let nextLogicalExpression: Node<'LogicalExpression'> | undefined = node;
				let exposureReported = false;
				let configReported = false;

				while (nextLogicalExpression) {
					const preconditionStatus = getPreconditionStatus(nextLogicalExpression, context);
					// Allow us to check for: fg('') && <Component />
					const isReturningValue =
						// Check if we are on the root logical expression
						// as this is where the returning value is
						// `node` is root logical expression
						isAssignmentStatement && nextLogicalExpression === node;

					if (!exposureReported && !isReturningValue && preconditionStatus === 'early-exposure') {
						context.report({
							messageId: 'incorrectExposure',
							node,
						});

						exposureReported = true;
					}

					if (!configReported && preconditionStatus === 'unnecessary-gate') {
						context.report({
							messageId: 'useConfig',
							node,
						});

						configReported = true;
					}

					if (exposureReported && configReported) {
						return;
					}

					nextLogicalExpression = isAndExpression(
						nextLogicalExpression.left as Node<'LogicalExpression'>,
					)
						? (nextLogicalExpression.left as Node<'LogicalExpression'>)
						: undefined;
				}
			},
		};
	},
};

export default rule;
