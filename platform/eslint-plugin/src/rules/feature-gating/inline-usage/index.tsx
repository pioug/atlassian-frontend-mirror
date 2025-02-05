import type { Rule } from 'eslint';
import { isAPIimport, type Node } from '../utils';

const FUNCTION_NAMES = new Set(['ff', 'fg', 'expVal', 'expValEquals', 'UNSAFE_noExposureExp']);
const STATSIG_ONLY_FUNCTION_NAMES = new Set([
	'fg',
	'expVal',
	'expValEquals',
	'UNSAFE_noExposureExp',
]);

const findDefinitionDeclaration = (
	node: Rule.Node,
): (Node<'VariableDeclaration'> | Node<'FunctionDeclaration'>) & Rule.NodeParentExtension =>
	node.type === 'VariableDeclaration' || node.type === 'FunctionDeclaration'
		? node
		: findDefinitionDeclaration(node.parent);

const validateCallExpression = (
	node: Node<'CallExpression'> & Rule.NodeParentExtension,
	context: Rule.RuleContext,
) => {
	const targetedFunctionsSwitch =
		context.options[0] === 'ssOnly' ? STATSIG_ONLY_FUNCTION_NAMES : FUNCTION_NAMES;

	const { callee } = node;
	const shouldWarn =
		callee.type === 'Identifier' &&
		targetedFunctionsSwitch.has(callee.name) &&
		isAPIimport(callee.name, context, node);

	if (shouldWarn) {
		const defDeclaration = findDefinitionDeclaration(node.parent);

		context.report({
			messageId: 'inlineUsage',
			node:
				defDeclaration.parent.type === 'ExportNamedDeclaration'
					? defDeclaration.parent
					: defDeclaration,
		});

		return true;
	}

	return false;
};

const validateBinaryExpression = (
	node: Node<'BinaryExpression'> & Rule.NodeParentExtension,
	context: Rule.RuleContext,
) => {
	// Match all comparator operators i.e ===, >=, <
	if (node.operator.match(/^[=|<|>]/)) {
		if (
			node.left.type === 'CallExpression' &&
			validateCallExpression(node.left as Node<'CallExpression'>, context)
		) {
			return;
		}

		if (node.right.type === 'CallExpression') {
			validateCallExpression(node.right as Node<'CallExpression'>, context);
		}
	}
};

const validateReturnExpression = ({ body }: Node<'BlockStatement'>, context: Rule.RuleContext) => {
	if (body.length !== 1) {
		return;
	}

	const [statement] = body;

	if (statement.type === 'ReturnStatement') {
		const { argument } = statement;

		if (argument && argument.type === 'CallExpression') {
			validateCallExpression(argument as Node<'CallExpression'>, context);
		} else if (argument && argument.type === 'BinaryExpression') {
			validateBinaryExpression(argument as Node<'BinaryExpression'>, context);
		}
	}
};

const validateFunctionBody = (
	body: Node<'BinaryExpression'> | Node<'CallExpression'> | Node<'BlockStatement'>,
	context: Rule.RuleContext,
) => {
	switch (body.type) {
		case 'CallExpression':
			validateCallExpression(body, context);
			break;
		case 'BinaryExpression':
			validateBinaryExpression(body, context);
			break;
		case 'BlockStatement':
			validateReturnExpression(body, context);
			break;
		default:
	}
};

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Ensure feature flags/gates and experiments are inlined so that they can be statically analyzable.',
			url: 'https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/browse/platform/packages/platform/eslint-plugin/src/rules/inline-usage/README.md',
		},
		schema: [
			{
				enum: ['ssOnly'],
			},
		],
		messages: {
			inlineUsage:
				'Do not export or wrap feature flags/gates and experiments usages. Inline calls at the callsite to ensure it is statically analyzable.',
		},
	},
	create(context) {
		return {
			'VariableDeclaration[declarations.length=1] > VariableDeclarator[id.type="Identifier"]:matches([init.type="ArrowFunctionExpression"], [init.type="FunctionExpression"]) > *.init':
				({ body }: Node<'FunctionDeclaration'>) => {
					validateFunctionBody(body as Node<'BlockStatement'> & Rule.NodeParentExtension, context);
				},
			FunctionDeclaration: ({ body }: Node<'FunctionDeclaration'>) => {
				validateFunctionBody(body as Node<'BlockStatement'> & Rule.NodeParentExtension, context);
			},
		};
	},
};

export default rule;
