import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

const EXPERIMENT_NAME = 'platform_editor_static_css';

/**
 * Recursively checks whether a css prop expression is gated by the migration experiment.
 *
 * Handles the expected patterns:
 *   - css={[expValEquals('platform_editor_static_css', ...) && styles]}
 *   - css={expValEquals(...) ? styles : undefined}
 *   - css={expValEquals(...) && styles}
 */
function isGatedByExperiment(node: TSESTree.Node): boolean {
	switch (node.type) {
		case 'CallExpression':
			return (
				node.callee.type === 'Identifier' &&
				node.callee.name === 'expValEquals' &&
				node.arguments[0]?.type === 'Literal' &&
				node.arguments[0].value === EXPERIMENT_NAME
			);
		case 'ArrayExpression':
			return node.elements.some((el) => el !== null && isGatedByExperiment(el));
		case 'LogicalExpression':
			return isGatedByExperiment(node.left) || isGatedByExperiment(node.right);
		case 'ConditionalExpression':
			return isGatedByExperiment(node.test);
		default:
			return false;
	}
}

function getJsxName(node: TSESTree.JSXOpeningElement): string | undefined {
	return node.name.type === 'JSXIdentifier' ? node.name.name : undefined;
}

function findCssProp(node: TSESTree.JSXOpeningElement): TSESTree.JSXAttribute | undefined {
	return node.attributes.find(
		(attr): attr is TSESTree.JSXAttribute =>
			attr.type === 'JSXAttribute' &&
			attr.name.type === 'JSXIdentifier' &&
			attr.name.name === 'css',
	);
}

/**
 * Enforces correct usage of components wrapped with `withCompiledMigration()`.
 *
 * The rule works in two phases:
 *
 * 1. **Collection phase** (`VariableDeclarator`): tracks which identifiers are
 *    assigned the result of a `withCompiledMigration(...)` call.
 *
 * 2. **Validation phase** (`JSXOpeningElement`): when a tracked component is
 *    rendered, checks that:
 *    - A `css` prop is present (otherwise compiled styles were likely forgotten).
 *    - The file doesn't use the emotion JSX pragma (which would intercept the
 *      `css` prop and treat it as emotion styles instead of compiled styles).
 *    - The `css` prop value is gated behind the migration experiment.
 *
 * As a performance optimisation, the rule bails out immediately if the source
 * text doesn't contain `withCompiledMigration` at all — which is the case for
 * the vast majority of files.
 */
const rule = ESLintUtils.RuleCreator.withoutDocs<
	[],
	'missingGate' | 'missingCssProp' | 'emotionPragma'
>({
	defaultOptions: [],
	meta: {
		type: 'problem',
		docs: {
			description:
				'Enforce that compiled css props on components returned from withCompiledMigration are gated behind the platform_editor_static_css experiment.',
			recommended: 'error',
		},
		messages: {
			missingGate: `The css prop on a component wrapped with withCompiledMigration must be gated behind the '${EXPERIMENT_NAME}' experiment. Use css={[expValEquals('${EXPERIMENT_NAME}', 'isEnabled', true) && styles]}.`,
			missingCssProp: `A component wrapped with withCompiledMigration is missing a css prop. Did you forget to apply the compiled styles? Use css={[expValEquals('${EXPERIMENT_NAME}', 'isEnabled', true) && styles]}.`,
			emotionPragma: `This file uses the emotion JSX pragma but passes a css prop to a migration-wrapped component. The css prop should contain compiled styles, so this file should not use the emotion pragma.`,
		},
		schema: [],
	},
	create(context) {
		const sourceText = context.getSourceCode().getText();

		if (!sourceText.includes('withCompiledMigration')) {
			return {};
		}

		const wrappedComponents = new Set<string>();
		const hasEmotionPragma =
			/\*\s*@jsx\s+jsx\b/u.test(sourceText) ||
			/@jsxImportSource\s+@emotion\/react/u.test(sourceText);

		return {
			// Phase 1: track identifiers assigned from withCompiledMigration(...)
			VariableDeclarator(node) {
				if (
					node.init?.type === 'CallExpression' &&
					node.init.callee.type === 'Identifier' &&
					node.init.callee.name === 'withCompiledMigration' &&
					node.id.type === 'Identifier'
				) {
					wrappedComponents.add(node.id.name);
				}
			},

			// Phase 2: validate css prop usage on tracked components
			JSXOpeningElement(node) {
				const name = getJsxName(node);
				if (!name || !wrappedComponents.has(name)) {
					return;
				}

				const cssProp = findCssProp(node);

				if (!cssProp) {
					context.report({ node, messageId: 'missingCssProp' });
					return;
				}

				if (hasEmotionPragma) {
					context.report({ node: cssProp, messageId: 'emotionPragma' });
					return;
				}

				const value = cssProp.value;
				if (
					!value ||
					value.type !== 'JSXExpressionContainer' ||
					!isGatedByExperiment(value.expression)
				) {
					context.report({ node: cssProp, messageId: 'missingGate' });
				}
			},
		};
	},
});

// Ignored via go/ees005
// eslint-disable-next-line import/no-commonjs
module.exports = rule;
