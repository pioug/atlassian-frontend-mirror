import { getImportDeclaration } from '@hypermod/utils';
import { type API, type FileInfo } from 'jscodeshift';

import { addCommentBefore } from '@atlaskit/codemod-utils/support';

const AVATAR_ENTRY_POINTS = ['@atlaskit/avatar', '@atlaskit/avatar/avatar'];

/**
 * Codemod to remove the deprecated `isDecorative` prop from Avatar.
 *
 * Migration:
 * - `isDecorative={true}` → `label=""`
 * - `isDecorative={false}` → prop removed (this was already the default behaviour)
 * - `isDecorative={expression}` → prop removed with a TODO comment to review manually
 *
 * See: https://atlassian.design/components/avatar/examples#accessibility
 */
export default function transformer(file: FileInfo, api: API): string {
	const j = api.jscodeshift;
	const source = j(file.source);

	// Find Avatar imports from any known entry point
	const avatarIdentifiers = new Set<string>();

	AVATAR_ENTRY_POINTS.forEach((entryPoint) => {
		const imports = getImportDeclaration(j, source, entryPoint);
		imports.forEach((importPath) => {
			importPath.value.specifiers?.forEach((specifier) => {
				if (specifier.type === 'ImportDefaultSpecifier') {
					avatarIdentifiers.add(specifier.local?.name || 'Avatar');
				} else if (
					specifier.type === 'ImportSpecifier' &&
					specifier.imported?.type === 'Identifier' &&
					(specifier.imported.name === 'default' || specifier.imported.name === 'Avatar')
				) {
					avatarIdentifiers.add(specifier.local?.name || 'Avatar');
				}
			});
		});
	});

	if (avatarIdentifiers.size === 0) {
		return file.source;
	}

	let hasChanges = false;

	source.find(j.JSXElement).forEach((path) => {
		const openingElement = path.value.openingElement;
		if (
			openingElement.name?.type !== 'JSXIdentifier' ||
			!avatarIdentifiers.has(openingElement.name.name)
		) {
			return;
		}

		const attrs = openingElement.attributes || [];
		const isDecorativeIndex = attrs.findIndex(
			(attr) =>
				attr.type === 'JSXAttribute' &&
				attr.name?.type === 'JSXIdentifier' &&
				attr.name.name === 'isDecorative',
		);

		if (isDecorativeIndex === -1) {
			return;
		}

		const isDecorativeAttr = attrs[isDecorativeIndex];
		if (isDecorativeAttr.type !== 'JSXAttribute') {
			return;
		}

		const value = isDecorativeAttr.value;

		// isDecorative (no value) or isDecorative={true} → add label=""
		const isTrueLiteral =
			value === null || // bare isDecorative
			(value?.type === 'JSXExpressionContainer' &&
				value.expression.type === 'BooleanLiteral' &&
				value.expression.value === true);

		// isDecorative={false} → just remove the prop
		const isFalseLiteral =
			value?.type === 'JSXExpressionContainer' &&
			value.expression.type === 'BooleanLiteral' &&
			value.expression.value === false;

		// Remove the isDecorative prop
		openingElement.attributes = attrs.filter((_, i) => i !== isDecorativeIndex);
		hasChanges = true;

		if (isTrueLiteral) {
			// Add label="" prop
			openingElement.attributes.push(j.jsxAttribute(j.jsxIdentifier('label'), j.stringLiteral('')));
		} else if (!isFalseLiteral) {
			// Dynamic expression — add a TODO comment for manual review on the
			// nearest enclosing statement so the comment isn't placed inside a
			// return(…) wrapper.
			let targetPath: typeof path | null = null;
			let current: ReturnType<typeof path.parentPath> = path.parentPath;
			while (current) {
				const nodeType = current.value?.type;
				if (
					nodeType === 'ReturnStatement' ||
					nodeType === 'ExpressionStatement' ||
					nodeType === 'VariableDeclaration'
				) {
					targetPath = current as unknown as typeof path;
					break;
				}
				current = current.parentPath;
			}
			addCommentBefore(
				j,
				j(targetPath ?? path),
				'The `isDecorative` prop has been removed from Avatar. ' +
					'If this avatar should be decorative (hidden from assistive technologies), add `label=""`. ' +
					'Otherwise, ensure the `name` or `label` prop provides a meaningful description.',
			);
		}
	});

	return hasChanges ? source.toSource({ quote: 'single' }) : file.source;
}
