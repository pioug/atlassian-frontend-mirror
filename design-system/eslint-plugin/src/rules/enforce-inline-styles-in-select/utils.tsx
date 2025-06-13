import type { Rule, Scope } from 'eslint';
import {
	type AssignmentExpression,
	type BlockStatement,
	type ExpressionStatement,
	isNodeOfType,
	type ObjectExpression,
	type ReturnStatement,
	type Statement,
} from 'eslint-codemod-utils';

const unsupportedSelectors = [
	':', // pseudo-classes/elements
	'[', // attribute selectors
	'>', // child combinator
	'+', // adjacent sibling combinator
	'~', // general sibling combinator
	' ', // descendant combinator
	'*', // universal selector
	'#', // ID selector
	'.', // class selector
	'@', // at-rules
	'&', // parent selector
	'|', // namespace separator
	'^', // starts with
	'$', // ends with
	'=', // equals
];

function checkForPseudoClasses(
	node: Rule.Node,
	objectExpression: ObjectExpression,
	context: Rule.RuleContext,
) {
	if (!isNodeOfType(objectExpression, 'ObjectExpression')) {
		return;
	}

	objectExpression.properties.forEach((prop) => {
		if (isNodeOfType(prop, 'Property')) {
			// Check if property key is a pseudo-class
			let keyValue = null;
			if (isNodeOfType(prop.key, 'Literal')) {
				keyValue = prop.key.value;
			} else if (isNodeOfType(prop.key, 'Identifier')) {
				keyValue = prop.key.name;
			}

			if (
				keyValue &&
				typeof keyValue === 'string' &&
				unsupportedSelectors.some((selector) => keyValue.includes(selector))
			) {
				context.report({
					node: prop.key,
					messageId: 'noPseudoClass',
					data: {
						pseudo: keyValue,
					},
				});
			}

			// Recursively check nested objects (for function return values)
			if (
				isNodeOfType(prop.value, 'ArrowFunctionExpression') ||
				isNodeOfType(prop.value, 'FunctionExpression')
			) {
				// Check the function body for returned object expressions
				const body = prop.value.body;
				if (isNodeOfType(body, 'ObjectExpression')) {
					checkForPseudoClasses(node, body, context);
				} else if (isNodeOfType(body, 'BlockStatement')) {
					// Look for return statements
					body.body.forEach((stmt) => {
						if (
							isNodeOfType(stmt, 'ReturnStatement') &&
							stmt.argument &&
							isNodeOfType(stmt.argument, 'ObjectExpression')
						) {
							checkForPseudoClasses(node, stmt.argument, context);
						}
					});
				}
			} else if (isNodeOfType(prop.value, 'ObjectExpression')) {
				checkForPseudoClasses(node, prop.value, context);
			}
		} else if (isNodeOfType(prop, 'SpreadElement')) {
			// Handle spread elements like ...styles or ...conditionalStyles
			checkSpreadElement(node, prop, context);
		}
	});
}

function checkSpreadElement(node: Rule.Node, spreadElement: any, context: Rule.RuleContext) {
	if (!isNodeOfType(spreadElement, 'SpreadElement')) {
		return;
	}

	const argument = spreadElement.argument;

	// Handle direct identifier (e.g., ...styles)
	if (isNodeOfType(argument, 'Identifier')) {
		const scope = context.getScope();
		let variable = null;
		let currentScope: Scope.Scope | null = scope;

		// Search through scope chain
		while (currentScope && !variable) {
			variable = currentScope.variables.find((v) => v.name === argument.name);
			currentScope = currentScope.upper;
		}

		if (variable && variable.defs.length > 0) {
			const def = variable.defs[0];
			if (isNodeOfType(def.node, 'VariableDeclarator') && def.node.init) {
				if (isNodeOfType(def.node.init, 'ObjectExpression')) {
					checkForPseudoClasses(node, def.node.init, context);
				}
			}
		}
	}
	// Handle conditional expressions (e.g., ...(condition ? { ':hover': ... } : undefined))
	else if (isNodeOfType(argument, 'ConditionalExpression')) {
		// Check both consequent and alternate
		if (isNodeOfType(argument.consequent, 'ObjectExpression')) {
			checkForPseudoClasses(node, argument.consequent, context);
		}
		if (argument.alternate && isNodeOfType(argument.alternate, 'ObjectExpression')) {
			checkForPseudoClasses(node, argument.alternate, context);
		}
	}
	// Handle logical expressions (e.g., ...condition && { ':hover': ... })
	else if (isNodeOfType(argument, 'LogicalExpression')) {
		if (isNodeOfType(argument.right, 'ObjectExpression')) {
			checkForPseudoClasses(node, argument.right, context);
		}
		if (isNodeOfType(argument.left, 'ObjectExpression')) {
			checkForPseudoClasses(node, argument.left, context);
		}
	}
	// Handle direct object expressions (e.g., ...{ ':hover': ... })
	else if (isNodeOfType(argument, 'ObjectExpression')) {
		checkForPseudoClasses(node, argument, context);
	}
}

export function checkStylesObject(node: Rule.Node, stylesValue: any, context: Rule.RuleContext) {
	if (!stylesValue) {
		return;
	}

	if (isNodeOfType(stylesValue, 'ObjectExpression')) {
		stylesValue.properties.forEach((prop) => {
			if (
				!isNodeOfType(prop, 'Property') ||
				!prop.value ||
				(!isNodeOfType(prop.value, 'ArrowFunctionExpression') &&
					!isNodeOfType(prop.value, 'FunctionExpression'))
			) {
				return;
			}

			const body = prop.value.body;
			if (isNodeOfType(body, 'ObjectExpression')) {
				checkForPseudoClasses(node, body, context);
			} else if (isNodeOfType(body, 'BlockStatement')) {
				const visitor = {
					ReturnStatement(returnStmt: ReturnStatement) {
						if (returnStmt.argument && isNodeOfType(returnStmt.argument, 'ObjectExpression')) {
							checkForPseudoClasses(node, returnStmt.argument, context);
						}
					},
					AssignmentExpression(assignExpr: AssignmentExpression) {
						// Handle cases like styles[':hover'] = { ... }
						const left = assignExpr.left;
						if (!isNodeOfType(left, 'MemberExpression')) {
							return;
						}
						const property = left.property;
						if (!isNodeOfType(property, 'Literal')) {
							return;
						}
						const value = property.value;
						if (typeof value !== 'string') {
							return;
						}

						if (unsupportedSelectors.some((selector) => value.includes(selector))) {
							context.report({
								node: property,
								messageId: 'noPseudoClass',
								data: {
									pseudo: value,
								},
							});
						}
					},
				};

				body.body.forEach((stmt) => {
					if (isNodeOfType(stmt, 'ReturnStatement')) {
						visitor.ReturnStatement(stmt);
					} else if (
						isNodeOfType(stmt, 'ExpressionStatement') &&
						isNodeOfType(stmt.expression, 'AssignmentExpression')
					) {
						visitor.AssignmentExpression(stmt.expression);
					} else if (isNodeOfType(stmt, 'IfStatement')) {
						const checkBlock = (block: BlockStatement | ExpressionStatement | Statement) => {
							if (isNodeOfType(block, 'BlockStatement')) {
								block.body.forEach((innerStmt) => {
									if (
										isNodeOfType(innerStmt, 'ExpressionStatement') &&
										isNodeOfType(innerStmt.expression, 'AssignmentExpression')
									) {
										visitor.AssignmentExpression(innerStmt.expression);
									}
								});
							} else if (
								isNodeOfType(block, 'ExpressionStatement') &&
								isNodeOfType(block.expression, 'AssignmentExpression')
							) {
								visitor.AssignmentExpression(block.expression);
							}
						};

						if (stmt.consequent) {
							checkBlock(stmt.consequent);
						}
						if (stmt.alternate) {
							checkBlock(stmt.alternate);
						}
					}
				});
			}
		});
	} else if (isNodeOfType(stylesValue, 'Identifier')) {
		// track the variable
		const scope = context.getScope();
		let variable = null;
		let currentScope: Scope.Scope | null = scope;

		// Search through scope chain
		while (currentScope && !variable) {
			variable = currentScope.variables.find((v) => v.name === stylesValue.name);
			currentScope = currentScope.upper;
		}

		if (variable && variable.defs.length > 0) {
			const def = variable.defs[0];
			if (isNodeOfType(def.node, 'VariableDeclarator') && def.node.init) {
				checkStylesObject(node, def.node.init, context);
			}
		}
	}
}
