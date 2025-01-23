/* eslint-disable @repo/internal/fs/filename-pattern-match */
import { getImportDeclaration } from '@hypermod/utils';
import {
	type API,
	type ASTPath,
	type FileInfo,
	type JSXAttribute,
	type JSXElement,
	type JSXSpreadAttribute,
} from 'jscodeshift';

import { addCommentBefore } from '@atlaskit/codemod-utils';

import {
	genericUnsupportedMigrationComment,
	spreadPropsComment,
	stylePropComment,
} from '../utils/comments';
import {
	LINK_ENTRY_POINT,
	LINK_EXPORT_NAME,
	PRINT_SETTINGS,
	UNSUPPORTED_STYLE_PROPS,
} from '../utils/constants';
import { findJSXAttributeWithValue } from '../utils/find-attribute-with-value';

type UnsupportedMigration = { name: string; reason: 'spreadProps' | 'styleProp' };

export default function transformer(file: FileInfo, api: API) {
	const j = api.jscodeshift;
	const source = j(file.source);

	// Find all native links
	const nativeLinks = source
		.find(j.JSXElement)
		.filter(
			(path) =>
				path.value.openingElement.name.type === 'JSXIdentifier' &&
				/^[a-z]+$/.test(path.value.openingElement.name.name) &&
				(path.value.openingElement.name.name === 'a' ||
					findJSXAttributeWithValue(path.value.openingElement, 'role', 'link')),
		);

	// No native links are found, exit early
	if (!nativeLinks.length) {
		return file.source;
	}

	// Links we can migrate
	const nativeLinksSupportedForMigration: ASTPath<JSXElement>[] = [];

	// Links we can't migrate, but will leave a code comment as a suggestion for manual migration
	const nativeLinksUnsupportedForMigration: Array<{
		path: ASTPath<JSXElement>;
		unsupportedMigrations: UnsupportedMigration[];
	}> = [];

	// Check for existing imports
	const existingLinkImports = getImportDeclaration(j, source, LINK_ENTRY_POINT);

	// Sets import name to be used. May be updated if an existing import is found with a different name
	let linkImportName = LINK_EXPORT_NAME;

	nativeLinks.forEach((path) => {
		const unsupportedMigrations = path.value.openingElement?.attributes?.reduce(
			(acc: UnsupportedMigration[], attribute: JSXAttribute | JSXSpreadAttribute) => {
				if (attribute.type === 'JSXSpreadAttribute') {
					acc.push({ name: '', reason: 'spreadProps' });
				} else if (UNSUPPORTED_STYLE_PROPS.includes(attribute.name.name.toString())) {
					acc.push({ name: attribute.name.name.toString(), reason: 'styleProp' });
				}
				return acc;
			},
			[],
		);

		if (unsupportedMigrations?.length) {
			nativeLinksUnsupportedForMigration.push({
				path,
				unsupportedMigrations,
			});
		} else {
			nativeLinksSupportedForMigration.push(path);
		}
	});

	if (nativeLinksSupportedForMigration.length) {
		// Generate a unique import name if there is a different existing import named "Link"
		let importNameSuffix = 1;
		let uniqueLinkImportName = linkImportName;

		while (
			source.find(j.ImportDeclaration).some((importDecl) => {
				return Boolean(
					importDecl.value.specifiers?.some((specifier) => {
						return specifier.local?.name === uniqueLinkImportName;
					}),
				);
			})
		) {
			uniqueLinkImportName = `${linkImportName}${importNameSuffix}`;
			importNameSuffix++;
		}
		linkImportName = uniqueLinkImportName;

		// Add link import
		// If no existing link imports are found, add a new import
		if (!existingLinkImports.length) {
			const linkImport = j.importDeclaration(
				[j.importDefaultSpecifier(j.identifier(linkImportName))],
				j.stringLiteral(LINK_ENTRY_POINT),
			);
			const importDeclarations = source.find(j.ImportDeclaration);
			if (importDeclarations.length) {
				importDeclarations
					.at(importDeclarations.length - 1)
					.get()
					.insertAfter(linkImport);
			} else {
				source.get().node.program.body.unshift(linkImport);
			}
		}
		// If an existing `@atlaskit/link import` is found, import Link if it's not already imported
		else {
			const hasExistingSpecifier = existingLinkImports.some((importDecl) => {
				return Boolean(
					importDecl.value.specifiers?.some((specifier) => {
						const isDefaultImport = specifier.type === 'ImportDefaultSpecifier';

						if (isDefaultImport && specifier.local?.name) {
							linkImportName = specifier.local?.name;

							return true;
						}
					}),
				);
			});

			if (!hasExistingSpecifier) {
				existingLinkImports
					.at(0)
					.get()
					.node.specifiers.push(j.importDefaultSpecifier(j.identifier(linkImportName)));
			}
		}

		nativeLinksSupportedForMigration.forEach((link) => {
			const { attributes } = link.node.openingElement;

			// Remove role="link" attributes
			const filteredAttributes = attributes?.filter(
				(attr) =>
					!(
						attr.type === 'JSXAttribute' &&
						attr.name.name === 'role' &&
						attr.value?.type === 'StringLiteral' &&
						attr.value.value === 'link'
					),
			);

			j(link).replaceWith(
				j.jsxElement.from({
					openingElement: j.jsxOpeningElement(
						j.jsxIdentifier(linkImportName),
						filteredAttributes,
						false,
					),
					closingElement: j.jsxClosingElement(j.jsxIdentifier(linkImportName)),
					children: link.node.children,
				}),
			);
		});
	}

	nativeLinksUnsupportedForMigration.forEach((link) => {
		addCommentBefore(
			j,
			j(link.path),
			`
${link.unsupportedMigrations
	.map((unsupported) => {
		switch (unsupported.reason) {
			case 'styleProp':
				return stylePropComment({ propName: unsupported.name });
			case 'spreadProps':
				return spreadPropsComment;
			default:
				break;
		}
	})
	.join('\n')}
${genericUnsupportedMigrationComment()}\n
`,
		);
	});

	return source.toSource(PRINT_SETTINGS);
}
