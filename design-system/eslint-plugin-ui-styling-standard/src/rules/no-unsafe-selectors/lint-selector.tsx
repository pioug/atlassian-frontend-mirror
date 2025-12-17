import type { Rule } from 'eslint';
import type * as ESTree from 'eslint-codemod-utils';
import { isNesting, type Selector } from 'postcss-selector-parser';

import { allowedPseudos, legacyPseudoElements } from './constants';
import { getRangeFromNode, getSourceLocationFromRange } from './source-position-utils';

type CheckArgs = {
	context: Rule.RuleContext;
	sourceNode: ESTree.Node;
	selector: Selector;
	config: { shouldAlwaysInsertNestingSelectorForAmbiguousPseudos: boolean };
	isXcssCall: boolean;
};

export function lintSelector(args: CheckArgs): void {
	checkNoAmbiguousPseudos(args);
	checkNoRestrictedPseudos(args);
	checkNoLegacyPseudoElementSyntax(args);
	checkNoIncreasedSpecificity(args);
}

/**
 * Ensures the use of a nesting selector `&` with pseudo-selectors.
 */
function checkNoAmbiguousPseudos({ context, sourceNode, selector, config, isXcssCall }: CheckArgs) {
	if (isXcssCall) {
		/**
		 * The `xcss` API does not currently support a leading `&`.
		 *
		 * This may change in the future, but we are ignoring `xcss` calls for now.
		 */
		return;
	}

	if (selector.first.type !== 'pseudo') {
		return;
	}

	const range = getRangeFromNode({ node: selector.first, sourceNode });
	const loc = getSourceLocationFromRange(context, range);

	if (config.shouldAlwaysInsertNestingSelectorForAmbiguousPseudos) {
		context.report({
			loc,
			messageId: 'no-ambiguous-pseudos',
			*fix(fixer) {
				yield fixer.insertTextBeforeRange(range, '&');
			},
		});
	} else {
		context.report({
			loc,
			messageId: 'no-ambiguous-pseudos',
			suggest: [
				{
					messageId: 'insert-nesting-selector',
					*fix(fixer) {
						yield fixer.insertTextBeforeRange(range, '&');
					},
				},
			],
		});
	}
}

function checkNoRestrictedPseudos({ context, sourceNode, selector }: CheckArgs) {
	selector.walkPseudos((pseudo) => {
		if (allowedPseudos.has(pseudo.value)) {
			return;
		}

		/**
		 * If someone has written `:after` it is allowed,
		 * they've just used the legacy syntax.
		 *
		 * This will be caught by the `no-legacy-pseudo-element-syntax` check.
		 */
		if (legacyPseudoElements.has(pseudo.value) && allowedPseudos.has(`:${pseudo.value}`)) {
			return;
		}

		if (!allowedPseudos.has(pseudo.value)) {
			const range = getRangeFromNode({ node: pseudo, sourceNode });
			const loc = getSourceLocationFromRange(context, range);

			context.report({
				loc,
				messageId: 'no-restricted-pseudos',
				data: {
					pseudo: pseudo.value,
				},
			});
		}
	});
}

/**
 * The original four pseudo-elements have a legacy single colon syntax.
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements
 */
function checkNoLegacyPseudoElementSyntax({ context, sourceNode, selector }: CheckArgs) {
	selector.walkPseudos((pseudo) => {
		if (legacyPseudoElements.has(pseudo.value)) {
			const range = getRangeFromNode({ node: pseudo, sourceNode });
			const loc = getSourceLocationFromRange(context, range);

			context.report({
				loc,
				messageId: 'no-legacy-pseudo-element-syntax',
				*fix(fixer) {
					yield fixer.insertTextBeforeRange(range, ':');
				},
			});
		}
	});
}

function checkNoIncreasedSpecificity({ context, sourceNode, selector }: CheckArgs) {
	selector.walkNesting((nesting) => {
		/**
		 * If it's not the start of a chain, then it's already been reported.
		 */
		if (isNesting(nesting.prev())) {
			return;
		}

		let next = nesting.next();

		/**
		 * If it is followed by something other than another nesting selector,
		 * then it isn't just there to increase specificity — it is actually necessary.
		 */
		if (next && !isNesting(next)) {
			return;
		}

		let lastNesting = nesting;
		while (isNesting(next)) {
			lastNesting = next;
			next = next.next();
		}

		const [start] = getRangeFromNode({ node: nesting, sourceNode });
		const [_, end] = getRangeFromNode({ node: lastNesting, sourceNode });

		const loc = getSourceLocationFromRange(context, [start, end]);

		context.report({
			loc,
			messageId: 'no-increased-specificity',
		});
	});
}
