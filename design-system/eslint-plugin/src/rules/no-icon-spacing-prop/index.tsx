import type { Rule } from 'eslint';

import { createIsFromImportSourceFor } from '../no-custom-icons/checks/is-from-import-source';
import { createLintRule } from '../utils/create-rule';
import { errorBoundary } from '../utils/error-boundary';

import {
	CSSMAP_VARIABLE_NAME,
	getCssMapKey,
	getIconSize,
	getSpacingAttribute,
	getStaticAttributeValue,
	hasSpreadProps,
	SPACING_TO_PADDING,
	upsertBoxImport,
	upsertCssMapImport,
	upsertCssMapVariable,
	upsertTokenImport,
} from './helpers';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-icon-spacing-prop',
		hasSuggestions: true,
		type: 'suggestion',
		docs: {
			description:
				'Disallows usage of the deprecated spacing prop on new icons. Use Box with cssMap for spacing instead.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noSpacingProp:
				"The `spacing` prop on icon component '{{iconName}}' is deprecated. Wrap the icon in a `<Box xcss={iconSpacingStyles.spaceXXX}>` using `cssMap` from `@atlaskit/css` instead.",
			noSpacingPropManual:
				"The `spacing` prop on icon component '{{iconName}}' is deprecated but cannot be auto-fixed ({{reason}}). Manually wrap the icon in a `<Box xcss={...}>` using `cssMap` from `@atlaskit/css`.",
			suggestRemoveSpacing: 'Remove the `spacing` prop.',
			suggestWrapInBox:
				'Wrap in `<Box xcss={{{cssMapVarName}}.{{cssMapKey}}}>` and remove the `spacing` prop.',
		},
	},

	create(context) {
		const isNewIcon = createIsFromImportSourceFor(
			/^@(atlaskit\/icon|atlaskit\/icon-lab|atlassian\/icon-private)\/core\//,
		);

		return errorBoundary({
			JSXElement(node: Rule.Node) {
				if (!isNewIcon(node)) {
					return;
				}

				const spacingAttr = getSpacingAttribute(node);
				if (!spacingAttr) {
					return;
				}

				const iconName =
					node.openingElement.name.type === 'JSXIdentifier'
						? node.openingElement.name.name
						: 'Unknown';

				const spacingValue = getStaticAttributeValue(spacingAttr);
				const hasSpread = hasSpreadProps(node);

				if (!spacingValue || hasSpread) {
					const reason = hasSpread ? 'spread props present' : 'dynamic spacing value';
					context.report({
						node: node.openingElement,
						messageId: 'noSpacingPropManual',
						data: { iconName, reason },
					});
					return;
				}

				if (spacingValue === 'none') {
					context.report({
						node: node.openingElement,
						messageId: 'noSpacingProp',
						data: { iconName },
						suggest: [
							{
								messageId: 'suggestRemoveSpacing',
								fix(fixer) {
									return fixer.remove(spacingAttr as unknown as Rule.Node);
								},
							},
						],
					});
					return;
				}

				const size = getIconSize(node);
				if (!size || !SPACING_TO_PADDING[size]?.[spacingValue]) {
					context.report({
						node: node.openingElement,
						messageId: 'noSpacingPropManual',
						data: {
							iconName,
							reason: `unknown size '${size}' or spacing '${spacingValue}'`,
						},
					});
					return;
				}

				const paddingToken = SPACING_TO_PADDING[size][spacingValue];
				const cssMapKey = getCssMapKey(paddingToken);

				context.report({
					node: node.openingElement,
					messageId: 'noSpacingProp',
					data: { iconName },
					suggest: [
						{
							messageId: 'suggestWrapInBox',
							data: { cssMapVarName: CSSMAP_VARIABLE_NAME, cssMapKey },
							fix(fixer) {
								const fixes: Rule.Fix[] = [];

								// 1. Remove spacing prop
								fixes.push(fixer.remove(spacingAttr as unknown as Rule.Node));

								// 2. Wrap in Box with cssMap reference
								fixes.push(
									fixer.insertTextBefore(
										node as unknown as Rule.Node,
										`<Box xcss={${CSSMAP_VARIABLE_NAME}.${cssMapKey}}>`,
									),
								);
								fixes.push(fixer.insertTextAfter(node as unknown as Rule.Node, `</Box>`));

								// 3. Insert/update cssMap variable after last import
								const cssMapFix = upsertCssMapVariable(context, fixer, paddingToken);
								if (cssMapFix) {
									fixes.push(cssMapFix);
								}

								// 4. Add/update @atlaskit/css import (cssMap)
								const cssFix = upsertCssMapImport(context, fixer);
								if (cssFix) {
									fixes.push(cssFix);
								}

								// 5. Add Box to @atlaskit/primitives/compiled
								const boxFix = upsertBoxImport(context, fixer);
								if (boxFix) {
									fixes.push(boxFix);
								}

								// 6. Add token from @atlaskit/tokens
								const tokenFix = upsertTokenImport(context, fixer);
								if (tokenFix) {
									fixes.push(tokenFix);
								}

								return fixes;
							},
						},
					],
				});
			},

			ImportDeclaration: isNewIcon.importDeclarationHook,
		});
	},
});

export default rule;
