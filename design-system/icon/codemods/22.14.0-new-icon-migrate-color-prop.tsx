import {
	hasImportDeclaration,
	hasJSXAttributes,
	insertCommentToStartOfFile,
} from '@codeshift/utils';
import type { API, Collection, default as core, FileInfo } from 'jscodeshift';

function insertTokenImport(j: core.JSCodeshift, source: Collection<any>) {
	if (hasImportDeclaration(j, source, '@atlaskit/tokens')) {
		return;
	}

	const newImport = j.importDeclaration(
		[j.importSpecifier(j.identifier('token'))],
		j.stringLiteral('@atlaskit/tokens'),
	);

	source.get().node.program.body.unshift(newImport);
}

export function getPartialImportDeclaration(
	j: core.JSCodeshift,
	source: Collection<any>,
	sourcePath: string,
): Collection<any> {
	return source
		.find(j.ImportDeclaration)
		.filter(
			(path) =>
				typeof path.node.source.value === 'string' && path.node.source.value.includes(sourcePath),
		);
}

function buildToken(j: core.JSCodeshift, tokenId: string = '', fallback: string) {
	const callExpr = j.callExpression(
		j.identifier('token'),
		[j.stringLiteral(tokenId), j.stringLiteral(fallback)].filter(Boolean),
	);

	return callExpr;
}

export default function transformer(file: FileInfo, api: API) {
	const j = api.jscodeshift;
	const source = j(file.source);

	// Find all new icon imports
	const coreIconImportDeclarations = getPartialImportDeclaration(j, source, '@atlaskit/icon/core');
	const utilityIconImportDeclarations = getPartialImportDeclaration(
		j,
		source,
		'@atlaskit/icon/utility',
	);
	const iconLabIconImportDeclarations = getPartialImportDeclaration(
		j,
		source,
		'@atlaskit/icon-lab/core',
	);

	// Get all the specifier names
	const newIconSpecifiers: string[] = [];
	[
		coreIconImportDeclarations,
		utilityIconImportDeclarations,
		iconLabIconImportDeclarations,
	].forEach((newIconImportDeclaration) => {
		newIconImportDeclaration.forEach((newIconImport) => {
			if (!newIconImport.value.specifiers) {
				return;
			}
			newIconImport.value.specifiers.map((specifier: any) => {
				if (specifier.local && specifier.local.name) {
					newIconSpecifiers.push(specifier.local.name);
				}
			});
		});
	});

	// No imports for new button found, exit early
	if (!newIconSpecifiers.length) {
		return source.toSource();
	}

	// Find all new icon JSX elements that don't have a `color` prop set
	const newIconJSXElements = source
		.find(j.JSXElement)
		// is a new icon?
		.filter(
			(path) =>
				path.value.openingElement.name.type === 'JSXIdentifier' &&
				newIconSpecifiers.includes(path.value.openingElement.name.name),
		)
		// has no color prop?
		.filter((path) => !hasJSXAttributes(j, path, 'color'));

	newIconJSXElements.forEach((newIconJSXElement) => {
		const newIconJSXElementValue = newIconJSXElement.value;
		const newIconJSXElementOpeningElement = newIconJSXElementValue.openingElement;

		// If spread props exist, add a comment and skip
		if (
			newIconJSXElementOpeningElement.attributes?.some((attr) => attr.type === 'JSXSpreadAttribute')
		) {
			insertCommentToStartOfFile(j, source, 'Migrate color prop');
			return;
		}

		// Insert the `color` prop
		newIconJSXElementOpeningElement.attributes?.push(
			j.jsxAttribute(
				j.jsxIdentifier('color'),
				j.jsxExpressionContainer(buildToken(j, 'color.icon', '#44546F')),
			),
		);
		insertTokenImport(j, source);
	});

	return source.toSource();
}
