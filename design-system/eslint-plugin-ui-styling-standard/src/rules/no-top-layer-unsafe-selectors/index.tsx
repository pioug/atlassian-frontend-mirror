import type { Rule } from 'eslint';
import type * as ESTree from 'eslint-codemod-utils';

import { getScope, getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import { isCss, isStyled } from '@atlaskit/eslint-utils/is-supported-import';
import { importSources } from '@atlaskit/eslint-utils/schema';

import { createLintRuleWithTypedConfig } from '../utils/create-rule-with-typed-config';
import { getStyleCalls } from '../utils/style-calls';
import { walkStyleCallProperties } from '../utils/walk-style-call-properties';
import { walkStyleObjectProperties } from '../utils/walk-style-object-properties';
import { findTemplateSelectors } from './find-template-selectors';
import { preserveListLayout } from './preserve-list-layout';
import { type RewriteResult, rewriteSelector } from './rewrite-selector';

/**
 * Names of JSX props whose value can be an inline style object.
 */
const STYLE_PROP_NAMES: ReadonlySet<string> = new Set(['css', 'xcss']);

/**
 * Element names an unquoted style-object key can spell: HTML, plus the SVG elements a component
 * styles often enough to write unquoted. Hyphenated custom elements cannot be identifiers.
 */
const HTML_TAG_NAMES: ReadonlySet<string> = new Set([
	'a',
	'abbr',
	'address',
	'article',
	'aside',
	'audio',
	'b',
	'blockquote',
	'body',
	'br',
	'button',
	'canvas',
	'caption',
	'cite',
	'code',
	'col',
	'colgroup',
	'dd',
	'del',
	'details',
	'dfn',
	'dialog',
	'div',
	'dl',
	'dt',
	'em',
	'fieldset',
	'figcaption',
	'figure',
	'footer',
	'form',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'header',
	'hr',
	'html',
	'i',
	'iframe',
	'img',
	'input',
	'ins',
	'kbd',
	'label',
	'legend',
	'li',
	'main',
	'mark',
	'menu',
	'meter',
	'nav',
	'object',
	'ol',
	'optgroup',
	'option',
	'output',
	'p',
	'picture',
	'pre',
	'progress',
	'q',
	's',
	'samp',
	'section',
	'select',
	'small',
	'source',
	'span',
	'strong',
	'sub',
	'summary',
	'sup',
	'table',
	'tbody',
	'td',
	'textarea',
	'tfoot',
	'th',
	'thead',
	'time',
	'tr',
	'u',
	'ul',
	'var',
	'video',
	'circle',
	'ellipse',
	'g',
	'line',
	'path',
	'polygon',
	'polyline',
	'rect',
	'svg',
	'text',
	'use',
]);

/**
 * TypeScript wrappers around an expression that ESTree does not model. All three leave the
 * runtime value untouched, so the rule looks through them.
 */
const TYPE_WRAPPER_TYPES: ReadonlySet<string> = new Set([
	'TSAsExpression',
	'TSSatisfiesExpression',
	'TSTypeAssertion',
]);

/**
 * One selector the rule has located in the source, with everything the fixer needs.
 */
type TSelectorSite = {
	/**
	 * The range of the *selector text itself*, excluding any surrounding quotes or backticks, so
	 * the fixer can replace it in place and the squiggle lands on it.
	 */
	range: [number, number];
	selector: string;
	/**
	 * Turn the rewritten selector into the source text that replaces `range`. Identity for a
	 * quoted key or a template, where the range already sits inside the delimiters; an
	 * unquoted identifier key has to gain quotes, because a guard is not a valid identifier.
	 */
	toSource: (rewritten: string) => string;
};

const rule: Rule.RuleModule = createLintRuleWithTypedConfig({
	meta: {
		name: 'no-top-layer-unsafe-selectors',
		docs: {
			description:
				'Disallows selectors that a Design System layering surface rendered in the browser top layer can wrongly match, or wrongly displace.',
			/**
			 * Deliberately not in `recommended` yet. The UI Styling Standard `recommended` preset
			 * is extended unscoped by `platform`, `jira`, `confluence` and eight other products, so
			 * enabling this before the bulk sweep has landed would break CI monorepo-wide on day
			 * one. Move it to `recommended` once the sweep is in and the ratchet is re-baselined.
			 */
			recommended: false,
			severity: 'error',
		},
		fixable: 'code',
		messages: {
			'unsafe-selector':
				'This selector can match a Design System layering surface rendered in the browser top layer, or be displaced by one. Add the top layer guard.',

			/**
			 * The guard closes part of the exposure and the rest needs a human: the transform's
			 * `reason` on a successful rewrite is a residual exposure, not decoration.
			 */
			'unsafe-selector-with-residual-exposure':
				'This selector can match a Design System layering surface rendered in the browser top layer, or be displaced by one. The top layer guard closes part of that, and the rest needs review: {{reason}}',

			/**
			 * "no guard form is available" rather than "exists": the positional family does have a
			 * guard form, verified in Chromium, and it is withheld because Compiled's extract mode
			 * emits no CSS for it. The `reason` says which of the two this site is.
			 */
			'no-guard-form':
				'This selector can be broken by a Design System layering surface rendered in the browser top layer, and no guard form is available for it. {{reason}}',

			'dynamic-selector':
				'This selector is constructed dynamically, so it cannot be checked for top layer safety. {{reason}}',

			'malformed-selector':
				'This selector could not be parsed, so it cannot be checked for top layer safety. {{reason}}',
		},

		schema: {
			type: 'object',
			properties: {
				importSources,
				/**
				 * Report selectors that are unsafe but for which no guard form is available. These
				 * cannot be autofixed — they need a human decision — so a codebase mid-migration
				 * may want them off until the residue has been triaged.
				 *
				 * Turning it off also hides the whole positional family, which is routed through
				 * this message while the `of S` form is withdrawn. See the README.
				 */
				reportSelectorsWithNoGuardForm: {
					type: 'boolean',
					default: true,
				},
				/**
				 * Report selectors the transform had to skip: ones constructed dynamically, and ones
				 * that do not parse as a selector at all. Off by default: neither is actionable
				 * in an editor.
				 */
				reportDynamicSelectors: {
					type: 'boolean',
					default: false,
				},
			},
			additionalProperties: false,
		},
	},
	create(context, config) {
		/**
		 * Report one selector, and autofix it when a guard form exists.
		 *
		 * Every selector the rule sees is written inside a style object, a style template or a
		 * `css` prop, so the transform is always asked for the `nested` reading.
		 */
		function check({ range, selector, toSource }: TSelectorSite): void {
			const result = rewriteSelector(selector, undefined, { scope: 'nested' });
			const source = getSourceCode(context);
			const loc = {
				start: source.getLocFromIndex(range[0]),
				end: source.getLocFromIndex(range[1]),
			};

			if (result.population === 'guardable') {
				if (result.after === null) {
					/* Provably already safe — nothing to write and nothing to report. */
					return;
				}
				const replacement = toSource(
					preserveListLayout({ original: selector, rewritten: result.after }),
				);
				context.report({
					loc,
					messageId: result.reason ? 'unsafe-selector-with-residual-exposure' : 'unsafe-selector',
					data: reportData(result),
					fix: (fixer) => fixer.replaceTextRange(range, replacement),
				});
				return;
			}

			if (result.population === 'residue') {
				if (config.reportSelectorsWithNoGuardForm) {
					context.report({ loc, messageId: 'no-guard-form', data: reportData(result) });
				}
				return;
			}

			if (result.population === 'skipped') {
				if (config.reportDynamicSelectors) {
					context.report({
						loc,
						messageId: result.skipCause === 'malformed' ? 'malformed-selector' : 'dynamic-selector',
						data: reportData(result),
					});
				}
			}
		}

		/**
		 * Check one property of a style object. A key is only a selector when its value is another
		 * style object — the same test `no-unsafe-selectors` and `no-nested-selectors` use — so a
		 * declaration such as `color: 'red'` or `'font-size': '12px'` is never read as one.
		 *
		 * Returns without reporting when the key is an at-rule, a computed name the rule cannot
		 * read, or a literal whose raw text is not a plain, unescaped string, because the fixer's
		 * range arithmetic would be wrong and a wrong fix is worse than none.
		 */
		function checkProperty(property: ESTree.Property): void {
			if (property.value.type !== 'ObjectExpression') {
				return;
			}

			const source = getSourceCode(context);
			const { key } = property;

			if (key.type === 'Literal' && typeof key.value === 'string') {
				if (isAtRule(key.value)) {
					return;
				}
				const raw = source.getText(key as unknown as Rule.Node);
				const inner = raw.slice(1, -1);
				if (inner !== key.value) {
					/* The literal uses escapes; leave it to a human. */
					return;
				}
				if (hasComment(key.value)) {
					return;
				}
				const [start, end] = key.range as [number, number];
				check({ range: [start + 1, end - 1], selector: key.value, toSource: identity });
				return;
			}

			if (key.type === 'TemplateLiteral') {
				const [start, end] = key.range as [number, number];
				const text = source.getText(key as unknown as Rule.Node).slice(1, -1);
				if (isAtRule(text) || hasComment(text)) {
					return;
				}
				check({ range: [start + 1, end - 1], selector: text, toSource: identity });
				return;
			}

			/**
			 * `css({ span: {…} })`. An unquoted key is the same selector as its quoted spelling,
			 * and the styling APIs read it the same way. A *computed* identifier (`[selector]: {…}`)
			 * is a variable, not a name, and is left alone.
			 *
			 * Only an element name counts. A camelCase key with an object value is far more often a
			 * container of the styling API itself (`selectors: {…}`) than a custom element, and
			 * "fixing" it to `'selectors:not(…)'` would break it.
			 */
			if (key.type === 'Identifier' && !property.computed && HTML_TAG_NAMES.has(key.name)) {
				check({
					range: key.range as [number, number],
					selector: key.name,
					toSource: (rewritten) => `'${rewritten}'`,
				});
			}
		}

		/**
		 * Stops the walk at a `@keyframes` block, whose keys are offsets rather than selectors.
		 * See {@link isKeyframesAtRule} for what goes wrong without it.
		 */
		function skipSubtree(property: ESTree.Property): boolean {
			const { key } = property;

			if (key.type === 'Literal' && typeof key.value === 'string') {
				return isKeyframesAtRule(key.value);
			}

			if (key.type === 'TemplateLiteral') {
				const source = getSourceCode(context);
				return isKeyframesAtRule(source.getText(key as unknown as Rule.Node).slice(1, -1));
			}

			/* An identifier or a computed key cannot spell an at-rule. */
			return false;
		}

		/**
		 * `css={{…}}`, `css={[{…}, {…}]}`, and either wrapped in `as` / `satisfies` / `<T>`.
		 */
		function walkStyleProp(expression: ESTree.Node): void {
			const unwrapped = unwrapTypeWrappers(expression);

			if (unwrapped.type === 'ObjectExpression') {
				walkStyleObjectProperties(unwrapped, checkProperty, { skipSubtree });
				return;
			}

			if (unwrapped.type === 'ArrayExpression') {
				for (const element of unwrapped.elements) {
					if (element && element.type !== 'SpreadElement') {
						walkStyleProp(element);
					}
				}
			}
		}

		return {
			/**
			 * `css({…})`, `cssMap({…})`, `xcss({…})`, `styled.div({…})`, `styled(Base)({…})`.
			 *
			 * The style calls are indexed once per file from the import bindings, so the rule does
			 * work proportional to the number of style calls rather than the number of calls.
			 */
			Program() {
				for (const styleCall of getStyleCalls(context)) {
					if (!config.importSources.includes(styleCall.importSource)) {
						continue;
					}
					walkStyleCallProperties(styleCall, checkProperty, { skipSubtree });
				}
			},

			/**
			 * ``styled.div`…` `` and ``css`…` ``. The style-call index cannot see these, so the
			 * template's raw text is scanned directly. ``keyframes`…` `` is not scanned: its blocks
			 * are keyed by `from`, `to` and percentages, none of which is an element selector.
			 */
			TaggedTemplateExpression(node: ESTree.TaggedTemplateExpression) {
				const { references } = getScope(context, node as unknown as ESTree.Node);
				const tag = node.tag as ESTree.CallExpression['callee'];

				const isStyleTemplate =
					isStyled(tag, references, config.importSources) ||
					isCss(tag, references, config.importSources);

				if (!isStyleTemplate) {
					return;
				}

				const source = getSourceCode(context);
				const quasi = node.quasi as unknown as Rule.Node;
				const [quasiStart] = quasi.range as [number, number];

				/* Scan the text *inside* the backticks, so the opening backtick can never be
				 * swallowed into the first selector. */
				const text = source.getText(quasi).slice(1, -1);

				for (const selector of findTemplateSelectors(text, quasiStart + 1)) {
					check({
						range: [selector.start, selector.end],
						selector: selector.text,
						toSource: identity,
					});
				}
			},

			/**
			 * `<div css={{ '& > div': {} }} />`. Only a *direct* object literal, or an array of
			 * them, is handled here — `css={css({…})}` is already covered by the style-call index,
			 * and handling it twice would double-report.
			 *
			 * No import is checked. Under the automatic JSX runtime the `css` prop needs no import
			 * at all, so gating on one would miss most real usage; `no-imported-style-values` reads
			 * the same props the same way.
			 */
			JSXAttribute(node: ESTree.Node) {
				if (node.type !== 'JSXAttribute') {
					return;
				}
				if (node.name.type !== 'JSXIdentifier' || !STYLE_PROP_NAMES.has(node.name.name)) {
					return;
				}
				if (!node.value || node.value.type !== 'JSXExpressionContainer') {
					return;
				}

				walkStyleProp(node.value.expression as ESTree.Node);
			},
		};
	},
});

export default rule;

function identity(text: string): string {
	return text;
}

/**
 * At-rules are blocks but not selectors; the transform has nothing to say about them, and
 * parsing `@media screen and (…)` as a selector would guard the media query.
 */
function isAtRule(text: string): boolean {
	return text.trimStart().startsWith('@');
}

/**
 * A comment vanishes when the CSS is tokenised, so a guard appended after one lands on the far
 * side of the whitespace around it: `& > div /* c *​/` would become the descendant selector
 * `div :not(…)`. Such a key is left alone, as a template selector with a comment inside it is.
 */
function hasComment(text: string): boolean {
	return text.includes('/*');
}

/**
 * `@keyframes` is the one at-rule whose children are not selectors either. Its keys are offsets
 * — `from`, `to`, `0%`, `50%` — and each parses cleanly as a tag selector, so without this the
 * walk into the block reports them and the autofix rewrites `from` to
 * `from:not(:where(…))`. That is not a valid keyframe selector, so the keyframe is dropped and
 * the animation stops, with no build error and nothing left for a re-lint to catch.
 *
 * Declining to *visit* the `@keyframes` property is not enough; the descent into its value has
 * to stop. Every other at-rule (`@media`, `@supports`, `@container`) nests real selectors and
 * must still be walked. Vendor prefixes are matched because `@-webkit-keyframes` is still shipped.
 */
function isKeyframesAtRule(text: string): boolean {
	return /^@(-[a-z]+-)?keyframes\b/i.test(text.trimStart());
}

function reportData(result: RewriteResult): Record<string, string> {
	return { reason: result.reason ?? '' };
}

/**
 * Look through `{…} as T`, `{…} satisfies T` and `<T>{…}`, which ESTree types do not model.
 */
function unwrapTypeWrappers(node: ESTree.Node): ESTree.Node {
	let current = node;
	while (TYPE_WRAPPER_TYPES.has(current.type)) {
		current = (current as unknown as { expression: ESTree.Node }).expression;
	}
	return current;
}
