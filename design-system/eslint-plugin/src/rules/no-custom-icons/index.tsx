import type { Rule } from 'eslint';
import type { ImportDeclaration } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';
import { errorBoundary } from '../utils/error-boundary';

import { hasProp } from './checks/has-prop';
import { createIsFromImportSourceFor } from './checks/is-from-import-source';

const rule = createLintRule({
	meta: {
		name: 'no-custom-icons',
		type: 'problem',
		docs: {
			description: 'Enforces custom glyph icons are used.',
			recommended: false,
			severity: 'warn',
		},
		schema: [
			{
				type: 'object',
				properties: {
					centralLocation: {
						type: 'string',
					},
					failSilently: {
						type: 'boolean',
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			noCustomIcons: `Custom icons/svgs from {{importSource}} are no longer supported. Migrate to an icon from '@atlaskit/(icon-labs|icon/core|icon/utility)'{{locationMessage}}.
[Migration guide](https://hello.atlassian.net/wiki/spaces/DST/pages/3748692796/New+ADS+iconography+-+Code+migration+guide).`,
		},
	},

	create(context: Rule.RuleContext) {
		const isIconSvg = createIsFromImportSourceFor('@atlaskit/icon/svg');
		const isIconBase = createIsFromImportSourceFor('@atlaskit/icon', '@atlaskit/icon/base');

		// TODO: JFP-2823 - this type cast was added due to Jira's ESLint v9 migration
		const { centralLocation = '', failSilently = false } = (context.options[0] ??
			{}) as unknown as {
			centralLocation?: string;
			failSilently?: boolean;
		};

		function checkNode(node: ImportDeclaration) {
			isIconBase.importDeclarationHook(node);
			isIconSvg.importDeclarationHook(node);
		}

		const locationMessage = centralLocation
			? `, move the icon to '${centralLocation}', or, if it's a third party logo, migrate to a standard <svg> element with a \`label\`.`
			: '';
		return errorBoundary(
			{
				JSXElement(node: Rule.Node) {
					const isSvg = isIconSvg(node);
					const isBase = isIconBase(node);
					// Not an icon import
					if (!isSvg && (!isBase || !hasProp(node, 'glyph'))) {
						return;
					}

					let importSource = '';
					if (isSvg) {
						importSource = isIconSvg.getImportSource(node);
					} else if (isBase) {
						importSource = isIconBase.getImportSource(node);
					}

					context.report({
						node: node.openingElement,
						messageId: 'noCustomIcons',
						data: { importSource, locationMessage },
					});
				},

				ImportDeclaration: checkNode,
			},
			failSilently,
		);
	},
});

export default rule;
