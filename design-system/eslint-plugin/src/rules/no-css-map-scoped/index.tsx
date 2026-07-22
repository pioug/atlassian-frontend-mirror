import type { Rule, Scope } from 'eslint';

import { getScope, getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import { CSS_IN_JS_IMPORTS, type ImportSource } from '@atlaskit/eslint-utils/is-supported-import';

import { createLintRule } from '../utils/create-lint-rule';

// `cssMapScoped` is an experimental, internal API in @compiled/react that is
// intentionally not exported from its public types. This rule prevents
// accidental adoption outside of the small set of packages (e.g. editor-core)
// that are allowed to use it.
//
// The detection logic mirrors @compiled/eslint-plugin's `no-css-map-scoped`
// rule (which lives in the nonAtomic patch). It is reimplemented here so this
// rule does not depend on the upstream rule being available at codegen time
// (the patch is applied during `afm install`, but codegen runs ahead of that).

const IMPORT_SOURCES: ImportSource[] = [CSS_IN_JS_IMPORTS.compiled, CSS_IN_JS_IMPORTS.atlaskitCss];

const isCssMapScopedCallee = (node: Rule.Node, references: Scope.Reference[]): boolean => {
	if (node.type !== 'Identifier') {
		return false;
	}

	return references.some(
		(reference) =>
			reference.identifier === node &&
			reference.resolved?.defs.some((def) => {
				if (def.type !== 'ImportBinding') {
					return false;
				}
				if (!def.parent || !IMPORT_SOURCES.includes(def.parent.source.value as ImportSource)) {
					return false;
				}
				return (
					def.node.type === 'ImportSpecifier' &&
					def.node.imported.type === 'Identifier' &&
					def.node.imported.name === 'cssMapScoped'
				);
			}),
	);
};

const noCssMapScopedRule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-css-map-scoped',
		type: 'problem',
		docs: {
			description:
				'Disallows usage of the experimental `cssMapScoped` API from `@compiled/react`. This API is internal and is not part of the public Compiled CSS-in-JS interface.',
			recommended: true,
			severity: 'error',
		},
		messages: {
			noCssMapScoped:
				'`cssMapScoped` is experimental and restricted. Use `cssMap` for standard atomic CSS map output, or contact the Compiled team for approval to use `cssMapScoped`.',
		},
		schema: [],
	},
	create(context) {
		const { text } = getSourceCode(context);
		if (IMPORT_SOURCES.every((importSource) => !text.includes(importSource))) {
			return {};
		}

		return {
			CallExpression(node) {
				const references = getScope(context, node).references;
				if (isCssMapScopedCallee(node.callee as Rule.Node, references)) {
					context.report({ node, messageId: 'noCssMapScoped' });
				}
			},
		};
	},
});

export default noCssMapScopedRule;
