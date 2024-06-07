// Original source from Compiled https://github.com/atlassian-labs/compiled/blob/master/packages/eslint-plugin/src/utils/create-no-tagged-template-expression-rule/to-arguments.ts
// eslint-disable-next-line import/no-extraneous-dependencies
import type { SourceCode } from 'eslint';
import type * as ESTree from 'estree';

import type { Argument, Block, DeclarationValue, Expression } from './types';

type ExpressionState = {
	expression: string;
	pos: number;
};

const getArguments = (
	chars: string,
	expressions: ExpressionState[] = [],
): (Expression | Block)[] => {
	if (!chars.trim().length && expressions) {
		return expressions.map(({ expression }) => ({
			type: 'expression',
			expression,
		}));
	}

	const args: (Expression | Block)[] = [];

	if (!chars.includes(':')) {
		return args;
	}

	// Split the property and value
	// e.g. `color: red` becomes ['color', 'red']
	// also consider `background: url("https://some-url-b")`, which has a colon in the value.
	const [property, ...v] = chars.split(':');
	const value = v.join(':');

	// Extract any expressions listed before the property that were not delimited by a ;
	if (expressions.length) {
		const lastPropertyRe = /[\w-]+(?![\s\S]*[\w-]+)/g;
		const prop = lastPropertyRe.exec(property);
		if (prop) {
			let i = 0;
			while (expressions[i] && expressions[i].pos < prop.index) {
				args.push({
					type: 'expression',
					expression: expressions[i].expression,
				});
				i++;
			}
			// Remove any expressions that have been added as an arg as they are not part of the declaration
			expressions = expressions.slice(i);
		}
	}

	const getValue = (): DeclarationValue => {
		/**
		 * This branch is required for handling interpolated functions:
		 *
		 * css`
		 *   color: ${(props) => props.textColor}
		 * `
		 *
		 * But it also breaks interpolations of multiple tokens:
		 *
		 * css`
		 *   padding: ${token('space.100')} ${token('space.200')}
		 * `
		 *
		 * which becomes invalid syntax:
		 *
		 * css({
		 *   padding: token('space.100')token('space.200')
		 * })
		 *
		 * Limiting this branch to when `expressions.length === 1` seems
		 * to allow both cases to work. There may be other edge cases,
		 * but none were caught by the existing test suite.
		 */
		if (!value.trim().length && expressions.length === 1) {
			return {
				type: 'expression',
				expression: expressions.map((e) => e.expression).join(''),
			};
		}

		if (expressions.length) {
			// When there are expressions in the value, insert the expressions and wrap the value in a template literal
			let val = chars;
			let offset = 1;
			for (const { expression, pos } of expressions) {
				const interpolation = '${' + expression + '}';
				val = val.substring(0, pos + offset) + interpolation + val.substring(pos + offset);
				offset += interpolation.length;
			}

			return {
				type: 'literal',
				value: '`' + val.replace(property + ':', '').trim() + '`',
			};
		}

		return {
			type: 'literal',
			value: isNaN(Number(value)) ? value.trim() : parseFloat(value),
		};
	};

	args.push({
		type: 'declaration',
		property: getPropertyForDeclaration(property),
		value: getValue(),
	});

	return args;
};

/**
 * Trims the property value. Converts it to camelCase if it isn't a variable.
 */
const getPropertyForDeclaration = (property: string): string => {
	const trimmed = property.trim();
	if (trimmed.startsWith('--')) {
		return trimmed;
	}
	// Make the property camelCase if it isn't a CSS variable
	return trimmed.replace(/-[a-z]/g, (match) => match[1].toUpperCase());
};

const getSelectorValue = (
	chars: string,
	expressions: { pos: number; expression: string }[],
): string => {
	// If no variable, returns chars immediately.
	// i.e. `.foo { color: red }` returns '.foo'
	if (expressions.length === 0) {
		return chars.trim();
	}

	let val = chars;
	let offset = 1;

	for (const { expression, pos } of expressions) {
		const interpolation = '${' + expression + '}';
		val = val.substring(0, pos + offset) + interpolation + val.substring(pos + offset);
		offset += interpolation.length;
	}

	// For simplicity, use template literals even if the whole selector is a variable
	// i.e. the output of `${VAR} { color: red }` is { [`${VAR}`]: { color: "red" } }
	return '`' + val.trim() + '`';
};

type Current = {
	parent: Current | undefined;
	args: Argument[];
};

type State = {
	chars: string;
	current: Current;
	expressions: ExpressionState[];
};

export const toArguments = (source: SourceCode, template: ESTree.TemplateLiteral): Argument[] => {
	const args: Argument[] = [];
	const state: State = {
		chars: '',
		current: {
			parent: undefined,
			args,
		},
		expressions: [],
	};

	const addArgument = (argument: Expression | Block) => {
		const { args } = state.current;
		if (argument.type === 'expression') {
			if (argument.expression.length) {
				args.push(argument);
			}
			return;
		}

		const lastArg = args[state.current.args.length - 1];
		if (lastArg?.type === 'block') {
			lastArg.blocks.push(argument);
		} else {
			args.push({
				type: 'block',
				blocks: [argument],
			});
		}
	};

	const addArguments = () => {
		const args = getArguments(state.chars, state.expressions);
		for (const arg of args) {
			addArgument(arg);
		}
	};

	for (const [i, quasi] of template.quasis.entries()) {
		// Deal with selectors across multiple lines
		const styleTemplateElement = quasi.value.raw
			.replace(/\/\*(.|\n|\r)*?\*\//g, '') // Removes multi-line comments
			// Remove single line comments
			// Negative lookbehind to handle URL-like double slashes
			.replace(/(?<!https?:)\/\/.*$/gm, '')
			.replace(/(\r\n|\n|\r)/gm, ' ')
			.replace(/\s+/g, ' ');

		for (const char of styleTemplateElement) {
			switch (char) {
				case '{': {
					const declarations: Argument[] = [];

					addArgument({
						type: 'rule',
						selector: getSelectorValue(state.chars, state.expressions),
						declarations,
					});

					state.chars = '';
					state.current = { parent: state.current, args: declarations };
					state.expressions = [];
					break;
				}

				case '}': {
					// Add any leftover arguments that were not delimited
					addArguments();

					state.chars = '';
					state.current = state.current.parent!;
					state.expressions = [];

					break;
				}

				case ';': {
					addArguments();

					state.chars = '';
					state.expressions = [];
					break;
				}

				default:
					state.chars += char;
					break;
			}
		}

		if (i < template.expressions.length) {
			state.expressions.push({
				pos: state.chars.length - 1,
				expression: source.getText(template.expressions[i]),
			});
		}
	}

	// Add any leftover arguments that were not delimited
	addArguments();

	return args;
};
