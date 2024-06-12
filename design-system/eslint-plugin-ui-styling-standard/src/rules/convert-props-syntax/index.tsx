import { analyze } from 'eslint-scope';
import type {
	ArrowFunctionExpression,
	AssignmentProperty,
	CallExpression,
	Identifier,
	MemberExpression,
	ObjectExpression,
} from 'estree-jsx';
import { createLintRule } from '../utils/create-rule';
import { isStyledComponents, isEmotion } from '@atlaskit/eslint-utils/is-supported-import';
import type { Rule, Scope, SourceCode } from 'eslint';
import ESTraverse from 'estraverse';
import { isNodeOfType } from 'eslint-codemod-utils';

type PropInfo = {
	/**
	 * Name of the prop, e.g. props, backgroundColor.
	 */
	propName: string;
	usages: (IdentifierWithParent | MemberExpressionWithParent)[];
};

type ValidPropsFound = {
	arrowFunctionExpression: ArrowFunctionExpression;
	props: PropInfo[];
	valid: true;
};

type IdentifierWithParent = Scope.Reference['identifier'] & Rule.NodeParentExtension;

type MemberExpressionWithParent = MemberExpression & Rule.NodeParentExtension;

/**
 * Represents some information about single line that contains some props, e.g.
 * the arrow function in
 *
 *     color: (props) => `mix(${props.myColor}, #fff)`
 *
 * or about a destructuring assignment, e.g. the arrow function in
 *
 *     color: ({ myColor, otherColor }) => someFunction(myColor, otherColor)
 *
 * or something that we don't recognise, or that we don't think is valid
 *
 *     color: (props, someOtherVariable) => someOtherVariable
 */
type PropsFound =
	| ValidPropsFound
	| {
			/**
			 * Props use a syntax we don't recognise, or we don't think is valid...
			 * or perhaps something unexpected happened in ESLint and we don't feel confident enough to try and autofix anything.
			 */
			valid: false;
	  };

const standardizePropExpression = (
	sourceCode: SourceCode,
	expression: MemberExpression | Identifier,
): string | undefined => {
	const propsObjectName = 'props';

	if (expression.type === 'Identifier') {
		return `${propsObjectName}.${expression.name}`;
	}

	if (expression.type === 'MemberExpression' && expression.property.type === 'Identifier') {
		const propertyName = sourceCode.getText(expression.property);
		return `${propsObjectName}.${propertyName}`;
	}

	// Cannot safely process the expression, bail out!
	return undefined;
};

const parseArrowFunctionExpression = (
	expression: ArrowFunctionExpression,
	sourceCode: SourceCode,
): PropsFound => {
	if (expression.params.length !== 1) {
		return { valid: false };
	}

	const scopeManager = analyze(expression, {});
	const currentScope = scopeManager.acquire(expression);

	if (!currentScope) {
		return { valid: false };
	}

	const parameter = expression.params[0];
	const props: PropInfo[] = [];

	// Don't bother handling type annotations that appear in the parameters of arrow functions.
	//
	// This only applies if the ESLint rule is running under @typescript-eslint (not regular eslint), hence the roundabout way we use to check whether parameter.typeAnnotation exists or not.
	if ('typeAnnotation' in parameter && parameter.typeAnnotation) {
		return { valid: false };
	}

	if (parameter.type === 'ObjectPattern') {
		if (parameter.properties.some((value) => value.type === 'RestElement')) {
			return { valid: false };
		}
		const properties = parameter.properties as AssignmentProperty[];

		for (const property of properties) {
			const propertyValue = property.value;
			// Don't bother supporting other patterns like rest elements, default values...
			if (propertyValue.type !== 'Identifier') {
				return { valid: false };
			}

			const variable = currentScope.variables.find((varb) => varb.name === propertyValue.name);

			if (!variable || !variable.references || !variable.references.length) {
				// Something went wrong, best to just bail out.
				return { valid: false };
			}

			const propName = standardizePropExpression(sourceCode, propertyValue);

			if (!propName) {
				return { valid: false };
			}

			props.push({
				propName,
				usages: variable.references.map(
					(reference) => reference.identifier as IdentifierWithParent,
				),
			});
		}
	} else if (parameter.type === 'Identifier') {
		const variable = currentScope.variables.find((varb) => varb.name === parameter.name);

		if (!variable || !variable.references || !variable.references.length) {
			// Something went wrong, best to just bail out.
			return { valid: false };
		}

		for (const reference of variable.references) {
			const memberExpression = (reference.identifier as IdentifierWithParent).parent;
			if (memberExpression.type !== 'MemberExpression') {
				// If reference.identifier.parent is not a member expression, that indicates
				// that we have a usage of the props argument that does NOT look like
				//
				//     (props) => props.color
				//
				// e.g. we might have (props) => props['...'] or (props) => `${props}px` perhaps...
				//
				// We have no choice but to bail out because the syntax is not what we expect.
				return { valid: false };
			}

			const propName = standardizePropExpression(sourceCode, memberExpression);

			if (!propName) {
				return { valid: false };
			}

			props.push({
				propName,
				usages: [memberExpression],
			});
		}
	} else {
		// Bail out for any syntax we don't recognise.
		return { valid: false };
	}

	return { arrowFunctionExpression: expression, props, valid: true };
};

const lintArguments = (context: Rule.RuleContext, args: CallExpression['arguments']) => {
	for (const argument of args) {
		if (argument.type === 'ArrowFunctionExpression') {
			// styled.div((props) => ({ ... }))
			// styled.div(({ color, height }) => ({ ... }))
			//
			// Already in the form we want.
			continue;
		} else if (argument.type === 'ObjectExpression') {
			const allProps: PropsFound[] = [];

			//            vvvvvvv
			// styled.div({ ... })
			for (const property of argument.properties) {
				if (property.type === 'SpreadElement') {
					// e.g.
					// styled.div({ color: 'blue', ...someStyles })
					//
					// If we have a spread element, we can no longer safely
					// transform this styled/css call without a lot more effort.
					//
					// Best to give up...
					return;
				} else {
					ESTraverse.traverse(property.value, {
						enter: function (node, _parent) {
							if (node.type === 'ArrowFunctionExpression') {
								const propNames = parseArrowFunctionExpression(node, context.getSourceCode());

								if (!propNames) {
									// We've encountered a CSS value we don't recognise, skip.
									return;
								}

								allProps.push(propNames);
							}
						},
						/**
						 * This is needed to handle unknown node types. Otherwise an error is thrown.
						 */
						fallback: 'iteration',
					});
				}
			}

			if (!allProps.length) {
				continue;
			}

			if (allProps.some((propUsage) => !propUsage.valid)) {
				context.report({
					node: argument,
					messageId: 'unsupported-prop-syntax-no-autofixer',
				});

				return;
			}

			context.report({
				node: argument,
				messageId: 'unsupported-prop-syntax',
				fix(fixer) {
					const sourceCode = context.getSourceCode();
					return fixPropsObjectUsages(
						fixer,
						sourceCode,
						argument,
						// The
						//     allProps.some((propUsage) => !propUsage.valid)
						// condition above should have made this type assertion unnecessary...
						allProps as ValidPropsFound[],
					);
				},
			});
		}
	}
};

type SectionToUpdate = {
	identifier: Identifier | MemberExpression;
	newCode: string;
	startIndex: number;
	endIndex: number;
};

const convertPropUsage = (
	propUsage: ValidPropsFound,
	sourceCode: SourceCode,
): string | undefined => {
	const arrowFunctionOffset = propUsage.arrowFunctionExpression.body.loc
		? {
				startIndex: sourceCode.getIndexFromLoc(propUsage.arrowFunctionExpression.body.loc.start),
				endIndex: sourceCode.getIndexFromLoc(propUsage.arrowFunctionExpression.body.loc.end),
			}
		: undefined;

	if (!arrowFunctionOffset) {
		return;
	}

	const sectionsToUpdate: SectionToUpdate[] = [];
	const newCode: string[] = [];

	for (const prop of propUsage.props) {
		for (const usage of prop.usages) {
			if (!usage.loc) {
				return;
			}

			sectionsToUpdate.push({
				identifier: usage,
				newCode: prop.propName,
				startIndex: sourceCode.getIndexFromLoc(usage.loc.start),
				endIndex: sourceCode.getIndexFromLoc(usage.loc.end),
			});
		}
	}

	sectionsToUpdate.sort((a, b) => {
		if (!a.identifier.loc || !b.identifier.loc) {
			return 0;
		}
		return (
			a.identifier.loc.start.line - b.identifier.loc.start.line ||
			a.identifier.loc.start.column - b.identifier.loc.start.column
		);
	});

	let prevEndIndex = arrowFunctionOffset.startIndex;
	for (const section of sectionsToUpdate) {
		if (prevEndIndex > section.startIndex || prevEndIndex >= section.endIndex) {
			// Props overlap! This is unexpected, bail out.
			return;
		}

		newCode.push(sourceCode.getText().slice(prevEndIndex, section.startIndex));
		newCode.push(section.newCode);

		prevEndIndex = section.endIndex;
	}

	newCode.push(sourceCode.getText().slice(prevEndIndex, arrowFunctionOffset.endIndex));

	return newCode.join('');
};

const fixPropsObjectUsages = (
	fixer: Rule.RuleFixer,
	sourceCode: SourceCode,
	expression: ObjectExpression,
	allProps: ValidPropsFound[],
): Rule.Fix[] => {
	const fixers = [
		// Wrap the object (containing the CSS properties and values) in an arrow function,
		// so it becomes something like
		//
		// styled.div(
		//   (props) => ({
		//     color: ...
		//   })
		// );
		fixer.insertTextBefore(expression, '(props) => ('),
		fixer.insertTextAfter(expression, ')'),
	];

	for (const propUsage of allProps) {
		const arrowFunctionExpression = propUsage.arrowFunctionExpression;
		const newCode = convertPropUsage(propUsage, sourceCode);

		if (newCode) {
			fixers.push(fixer.replaceText(arrowFunctionExpression, newCode));
		}
	}

	return fixers;
};

export const rule = createLintRule({
	meta: {
		name: 'convert-props-syntax',
		docs: {
			description:
				'Convert props syntax that is unsupported by styled-components@<4 or @emotion/styled to props syntax that is supported. This is useful when used in conjunction with `no-styled-tagged-template-expression`, as output from the latter may use props syntax unsupported by those libraries.',
			recommended: true,
			severity: 'error',
		},
		fixable: 'code',
		messages: {
			'unsupported-prop-syntax':
				'This syntax is not supported by styled-components@<4 or @emotion/styled and will fail at runtime!\n\nTo fix this, you can either migrate this to `@compiled/react`, or use the autofixer to switch the syntax from the `styled.div({ property: (props) => props.value })` syntax to the `styled.div(props => ({ property: props.value }))` syntax.',

			'unsupported-prop-syntax-no-autofixer':
				'This syntax is not supported by styled-components@<4 or @emotion/styled and will fail at runtime!\n\nTo fix this, you can either migrate this to `@compiled/react`, or manually migrate the syntax from the `styled.div({ property: (props) => props.value })` syntax to the `styled.div(props => ({ property: props.value }))` syntax.\n\nCheck out the rule documentation for examples.',
		},
		type: 'problem',
	},
	create(context) {
		return {
			CallExpression: (node: CallExpression) => {
				const references = context.getScope().references;

				// Rule should ignore .attrs() calls
				if (
					node.callee.type === 'MemberExpression' &&
					node.callee.property.type === 'Identifier' &&
					node.callee.property.name === 'attrs'
				) {
					return;
				}

				const callee = node.callee.type === 'MemberExpression' ? node.callee.object : node.callee;

				if (!isStyledComponents(callee, references) && !isEmotion(callee, references)) {
					return;
				}

				/**
				 * We only want to lint the second set of arguments in the following cases:
				 *
				 * 1. styled(BaseComponent)({ ... })
				 * 2. styled(BaseComponent)``
				 */
				if (
					// Using this type assertion to cast into a more useful type
					// For some reason the estree types are missing useful things like `parent`
					isNodeOfType(node, 'CallExpression') &&
					(node.parent?.type === 'CallExpression' ||
						node.parent?.type === 'TaggedTemplateExpression')
				) {
					return;
				}

				lintArguments(context, node.arguments);
			},
		};
	},
});

export default rule;
