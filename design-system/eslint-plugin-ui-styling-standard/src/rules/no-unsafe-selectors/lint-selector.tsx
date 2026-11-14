import type { Rule } from 'eslint';
import type * as ESTree from 'eslint-codemod-utils';
import { isNesting, isPseudo } from 'postcss-selector-parser';

import { allowedPseudos } from './constants';
import { getSourceLocationFromRange } from './get-source-location-from-range';
import { getRangeFromNode } from './source-position-utils';

/**
 * Structural stand-ins for postcss-selector-parser types. Importing Selector /
 * Pseudo / Nesting under TSRS expands into an infinite Container/Diff cycle.
 */
type SelectorNodeLike = {
	type: string;
	sourceIndex: number;
	value: string;
	prev: () => unknown;
	next: () => unknown;
};

type SelectorLike = {
	first: SelectorNodeLike;
	walk: (callback: (node: unknown) => false | undefined) => void;
};

type CheckArgs = {
	context: Rule.RuleContext;
	sourceNode: ESTree.Node;
	selector: SelectorLike;
	config: { shouldAlwaysInsertNestingSelectorForAmbiguousPseudos: boolean };
	isXcssCall: boolean;
};

export function lintSelector(args: CheckArgs): void {
	checkNoAmbiguousPseudos(args);

	const pseudos: SelectorNodeLike[] = [];
	const nestings: SelectorNodeLike[] = [];
	args.selector.walk((node) => {
		if (isPseudo(node as Parameters<typeof isPseudo>[0])) {
			pseudos.push(node as SelectorNodeLike);
		} else if (isNesting(node as Parameters<typeof isNesting>[0])) {
			nestings.push(node as SelectorNodeLike);
		}
	});

	checkNoRestrictedPseudos(args, pseudos);
	checkNoLegacyPseudoElementSyntax(args, pseudos);
	checkNoIncreasedSpecificity(args, nestings);
}

const legacyPseudoElements: Set<string> = new Set([
	':after',
	':before',
	':first-letter',
	':first-line',
]);

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

function checkNoRestrictedPseudos(
	{ context, sourceNode }: CheckArgs,
	pseudos: readonly SelectorNodeLike[],
) {
	for (const pseudo of pseudos) {
		if (allowedPseudos.has(pseudo.value) || isInAllowedPseudoChain(pseudo)) {
			continue;
		}

		/**
		 * If someone has written `:after` it is allowed,
		 * they've just used the legacy syntax.
		 *
		 * This will be caught by the `no-legacy-pseudo-element-syntax` check.
		 */
		if (legacyPseudoElements.has(pseudo.value) && allowedPseudos.has(`:${pseudo.value}`)) {
			continue;
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
	}
}

/**
 * The allowlist includes chained pseudos such as `:focus:not(:focus-visible)` whose parts are not
 * all allowed on their own, so a pseudo is also allowed when a run of adjacent pseudos containing
 * it matches an allowlisted chain.
 */
function isInAllowedPseudoChain(pseudo: SelectorNodeLike): boolean {
	const chain: SelectorNodeLike[] = [pseudo];
	for (
		let node = pseudo.prev();
		isPseudo(node as Parameters<typeof isPseudo>[0]);
		node = (node as SelectorNodeLike).prev()
	) {
		chain.unshift(node as SelectorNodeLike);
	}
	for (
		let node = pseudo.next();
		isPseudo(node as Parameters<typeof isPseudo>[0]);
		node = (node as SelectorNodeLike).next()
	) {
		chain.push(node as SelectorNodeLike);
	}
	const index = chain.indexOf(pseudo);
	for (let start = 0; start <= index; start++) {
		for (let end = index + 1; end <= chain.length; end++) {
			const text = chain
				.slice(start, end)
				.map((node) => String(node).replace(/\s+/g, ''))
				.join('');
			if (allowedPseudos.has(text)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * The original four pseudo-elements have a legacy single colon syntax.
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements
 */
function checkNoLegacyPseudoElementSyntax(
	{ context, sourceNode }: CheckArgs,
	pseudos: readonly SelectorNodeLike[],
) {
	for (const pseudo of pseudos) {
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
	}
}

function checkNoIncreasedSpecificity(
	{ context, sourceNode }: CheckArgs,
	nestings: readonly SelectorNodeLike[],
) {
	for (const nesting of nestings) {
		/**
		 * If it's not the start of a chain, then it's already been reported.
		 */
		if (isNesting(nesting.prev() as Parameters<typeof isNesting>[0])) {
			continue;
		}

		let next = nesting.next();

		/**
		 * If it is followed by something other than another nesting selector,
		 * then it isn't just there to increase specificity — it is actually necessary.
		 */
		if (next && !isNesting(next as Parameters<typeof isNesting>[0])) {
			continue;
		}

		let lastNesting = nesting;
		while (isNesting(next as Parameters<typeof isNesting>[0])) {
			lastNesting = next as SelectorNodeLike;
			next = lastNesting.next();
		}

		const [start] = getRangeFromNode({ node: nesting, sourceNode });
		const [_, end] = getRangeFromNode({ node: lastNesting, sourceNode });

		const loc = getSourceLocationFromRange(context, [start, end]);

		context.report({
			loc,
			messageId: 'no-increased-specificity',
		});
	}
}
