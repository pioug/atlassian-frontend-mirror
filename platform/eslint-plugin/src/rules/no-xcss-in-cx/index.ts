import type { Rule } from 'eslint';
import type { Node } from 'estree';
// Side-effect import: augments the `estree` Node/Expression unions with JSX
// members (JSXAttribute, JSXIdentifier, JSXExpressionContainer, ...) so the
// JSXAttribute visitor below can narrow `Rule.Node` correctly.
import type {} from 'estree-jsx';

import { getImportSources, isCxFunction, isXcss } from '@atlaskit/eslint-utils/is-supported-import';
import { getScope } from '../util/context-compat';

/**
 * Disallows passing xcss() results into cx() when used in an xcss prop.
 *
 * xcss() from @atlaskit/primitives and cx() from @atlaskit/css / @compiled/react
 * are incompatible — xcss() produces an opaque StyleRule object, while cx()
 * expects Compiled atomic class name strings. Mixing them causes runtime errors.
 * xcss() results must never be passed to cx(), whether inline or pre-defined.
 *
 * ❌ Wrong — xcss() called inline inside cx():
 *   xcss={cx(xcss({ color: 'red' }), xcss({ fontWeight: 'bold' }))}
 *
 * ❌ Also wrong — xcss() results pre-defined but still passed into cx():
 *   const baseStyles = xcss({ color: 'red' });
 *   const boldStyles = xcss({ fontWeight: 'bold' });
 *   xcss={cx(baseStyles, boldStyles)}
 *
 * ✅ Correct — pass xcss() results directly to the xcss prop (no cx()):
 *   const baseStyles = xcss({ color: 'red' });
 *   xcss={baseStyles}
 *
 * ✅ Correct — use cssMap() + cx() (cssMap is compatible with cx()):
 *   const styles = cssMap({ base: { color: 'red' } });
 *   xcss={cx(styles.base, condition && styles.focused)}
 *
 * This rule is import-aware: it only flags xcss() calls (inline or via variable)
 * imported from @atlaskit/primitives inside cx() calls imported from @atlaskit/css
 * or @compiled/react that appear inside an xcss prop.
 */
const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Disallow calling xcss() inline inside cx() in an xcss prop. Define styles at module level instead.',
		},
		messages: {
			noXcssInCx:
				'Do not pass xcss() results into cx(). ' +
				'xcss() produces a StyleRule object that is incompatible with cx(), which expects Compiled atomic class names. ' +
				'Pass xcss() results directly to the xcss prop instead: xcss={myStyles}. ' +
				'To conditionally combine styles, use cssMap() + cx(): const styles = cssMap({...}); xcss={cx(styles.base, cond && styles.active)}',
		},
		schema: [],
	},
	create(context) {
		return {
			JSXAttribute(node: Rule.Node) {
				// Narrow Rule.Node to JSXAttribute (estree-jsx augments the `estree` Node
				// union with JSX members, so this discriminated narrowing is safe).
				if (node.type !== 'JSXAttribute') {
					return;
				}

				// Only check `xcss` props
				if (node.name.type !== 'JSXIdentifier' || node.name.name !== 'xcss') {
					return;
				}

				if (!node.value || node.value.type !== 'JSXExpressionContainer') {
					return;
				}

				const expression = node.value.expression;
				if (expression.type === 'JSXEmptyExpression') {
					return;
				}

				// Early-return if the expression cannot possibly contain a cx() call —
				// avoids the cost of getImportSources/getScope on simple references like xcss={baseStyles}.
				const isCallOrArray =
					expression.type === 'CallExpression' || expression.type === 'ArrayExpression';
				if (!isCallOrArray) {
					return;
				}

				const importSources = getImportSources(context);
				const { references } = getScope(context, node);

				/**
				 * Returns true if an Identifier node resolves to a variable whose
				 * initializer is a call to xcss() imported from @atlaskit/primitives.
				 *
				 * Walks up the scope chain from the current JSXAttribute scope to find
				 * the variable definition, since module-level variables are not in the
				 * local scope's references list.
				 *
				 * e.g. `const baseStyles = xcss({ color: 'red' })` — passing `baseStyles`
				 * here returns true.
				 */
				const isXcssVariable = (identNode: Node): boolean => {
					if (identNode.type !== 'Identifier') {
						return false;
					}
					const name = identNode.name;
					// Walk up the scope chain to find the variable definition
					let currentScope: import('eslint').Scope.Scope | null = getScope(context, node);
					while (currentScope) {
						const variable = currentScope.set.get(name);
						if (variable) {
							for (const def of variable.defs) {
								if (
									def.type === 'Variable' &&
									def.node.type === 'VariableDeclarator' &&
									def.node.init?.type === 'CallExpression'
								) {
									// isXcss checks the callee identifier against referencesInScope to
									// find the import binding. The callee lives in the same scope as the
									// variable definition, so use all references from that scope.
									const defScopeRefs = currentScope.references;
									if (isXcss(def.node.init.callee, defScopeRefs, importSources)) {
										return true;
									}
								}
							}
							// Found the variable but it's not an xcss() call
							return false;
						}
						currentScope = currentScope.upper;
					}
					return false;
				};

				/**
				 * Recursively check a node that is an argument to cx() for xcss() results —
				 * both inline calls and references to variables initialised with xcss().
				 * Recurses into LogicalExpression (&&, ||) and ConditionalExpression (? :) so that
				 * patterns like cx(cond && xcss({...})) and cx(cond ? baseStyles : a) are caught.
				 */
				const checkArgForXcss = (argNode: Node): void => {
					if (!argNode) {
						return;
					}
					// Inline: cx(xcss({ color: 'red' }))
					if (
						argNode.type === 'CallExpression' &&
						isXcss(argNode.callee, references, importSources)
					) {
						context.report({ node: argNode, messageId: 'noXcssInCx' });
						return;
					}
					// Variable reference: cx(baseStyles) where baseStyles = xcss({...})
					if (isXcssVariable(argNode)) {
						context.report({ node: argNode, messageId: 'noXcssInCx' });
						return;
					}
					// Recurse into `cond && xcss({...})` or `cond || xcss({...})`
					if (argNode.type === 'LogicalExpression') {
						checkArgForXcss(argNode.left);
						checkArgForXcss(argNode.right);
					}
					// Recurse into `cond ? xcss({...}) : fallback`
					if (argNode.type === 'ConditionalExpression') {
						checkArgForXcss(argNode.consequent);
						checkArgForXcss(argNode.alternate);
					}
				};

				/**
				 * Check all arguments of a cx() call for inline xcss() calls.
				 * Reports each xcss() call found as a violation.
				 */
				const checkCxArgs = (callNode: Node): void => {
					if (callNode.type !== 'CallExpression') {
						return;
					}
					if (!isCxFunction(callNode.callee, references, importSources)) {
						return;
					}
					for (const arg of callNode.arguments) {
						if (arg) {
							checkArgForXcss(arg.type === 'SpreadElement' ? arg.argument : arg);
						}
					}
				};

				// Case 1: xcss={cx(...)} — cx() directly as the xcss value
				checkCxArgs(expression);

				// Case 2: xcss={[..., cx(...), ...]} — cx() inside an xcss array
				if (expression.type === 'ArrayExpression') {
					for (const element of expression.elements) {
						if (element) {
							checkCxArgs(element.type === 'SpreadElement' ? element.argument : element);
						}
					}
				}
			},
		};
	},
};

export default rule;
