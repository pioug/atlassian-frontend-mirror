/**
 * Codemod: replace-colors-with-hex
 *
 * Replaces all color imports from `@atlaskit/theme` (and `@atlaskit/theme/colors`)
 * with their literal hex code equivalents.
 *
 * Handles the following import patterns:
 *
 * 1. Named `colors` namespace import from the main package:
 *    import { colors } from '@atlaskit/theme';
 *    // colors.R50 → '#FFEBE6'
 *
 * 2. Named specifier import of individual colors from the main package:
 *    import { R50, B400 } from '@atlaskit/theme/colors';
 *    // R50 → '#FFEBE6', B400 → '#0052CC'
 *
 * 3. Namespace import of all colors:
 *    import * as colors from '@atlaskit/theme/colors';
 *    // colors.R50 → '#FFEBE6'
 *
 * 4. Default import of the colors object:
 *    import colors from '@atlaskit/theme/colors';
 *    // colors.R50 → '#FFEBE6'
 *
 * After replacing all usages the now-unused import specifier/declaration is removed.
 */
import type {
	API,
	ASTPath,
	default as core,
	FileInfo,
	ImportDeclaration,
	Options,
} from 'jscodeshift';

// ---------------------------------------------------------------------------
// Color map — all exports from @atlaskit/theme/colors
// ---------------------------------------------------------------------------
const COLOR_MAP: Record<string, string> = {
	// Reds
	R50: '#FFEBE6',
	R75: '#FFBDAD',
	R100: '#FF8F73',
	R200: '#FF7452',
	R300: '#FF5630',
	R400: '#DE350B',
	R500: '#BF2600',

	// Yellows
	Y50: '#FFFAE6',
	Y75: '#FFF0B3',
	Y100: '#FFE380',
	Y200: '#FFC400',
	Y300: '#FFAB00',
	Y400: '#FF991F',
	Y500: '#FF8B00',

	// Greens
	G50: '#E3FCEF',
	G75: '#ABF5D1',
	G100: '#79F2C0',
	G200: '#57D9A3',
	G300: '#36B37E',
	G400: '#00875A',
	G500: '#006644',

	// Blues
	B50: '#DEEBFF',
	B75: '#B3D4FF',
	B100: '#4C9AFF',
	B200: '#2684FF',
	B300: '#0065FF',
	B400: '#0052CC',
	B500: '#0747A6',
	B600: '#669DF1',
	B700: '#8FB8F6',

	// Purples
	P50: '#EAE6FF',
	P75: '#C0B6F2',
	P100: '#998DD9',
	P200: '#8777D9',
	P300: '#6554C0',
	P400: '#5243AA',
	P500: '#403294',

	// Teals
	T50: '#E6FCFF',
	T75: '#B3F5FF',
	T100: '#79E2F2',
	T200: '#00C7E6',
	T300: '#00B8D9',
	T400: '#00A3BF',
	T500: '#008DA6',

	// Neutrals
	N0: '#FFFFFF',
	N10: '#FAFBFC',
	N20: '#F4F5F7',
	N30: '#EBECF0',
	N40: '#DFE1E6',
	N50: '#C1C7D0',
	N60: '#B3BAC5',
	N70: '#A5ADBA',
	N80: '#97A0AF',
	N90: '#8993A4',
	N100: '#7A869A',
	N200: '#6B778C',
	N300: '#5E6C84',
	N400: '#505F79',
	N500: '#42526E',
	N600: '#344563',
	N700: '#253858',
	N800: '#172B4D',
	N900: '#091E42',

	// Neutral alpha tints (rgba strings)
	N10A: 'rgba(9, 30, 66, 0.02)',
	N20A: 'rgba(9, 30, 66, 0.04)',
	N30A: 'rgba(9, 30, 66, 0.08)',
	N40A: 'rgba(9, 30, 66, 0.13)',
	N50A: 'rgba(9, 30, 66, 0.25)',
	N60A: 'rgba(9, 30, 66, 0.31)',
	N70A: 'rgba(9, 30, 66, 0.36)',
	N80A: 'rgba(9, 30, 66, 0.42)',
	N90A: 'rgba(9, 30, 66, 0.48)',
	N100A: 'rgba(9, 30, 66, 0.54)',
	N200A: 'rgba(9, 30, 66, 0.60)',
	N300A: 'rgba(9, 30, 66, 0.66)',
	N400A: 'rgba(9, 30, 66, 0.71)',
	N500A: 'rgba(9, 30, 66, 0.77)',
	N600A: 'rgba(9, 30, 66, 0.82)',
	N700A: 'rgba(9, 30, 66, 0.89)',
	N800A: 'rgba(9, 30, 66, 0.95)',

	// Dark Mode Neutrals
	DN900: '#E6EDFA',
	DN800: '#DCE5F5',
	DN700: '#CED9EB',
	DN600: '#B8C7E0',
	DN500: '#ABBBD6',
	DN400: '#9FB0CC',
	DN300: '#8C9CB8',
	DN200: '#7988A3',
	DN100: '#67758F',
	DN90: '#56637A',
	DN80: '#455166',
	DN70: '#3B475C',
	DN60: '#313D52',
	DN50: '#283447',
	DN40: '#202B3D',
	DN30: '#1B2638',
	DN20: '#121A29',
	DN10: '#0E1624',
	DN0: '#0D1424',

	// Dark Mode alpha tints (rgba strings)
	DN800A: 'rgba(13, 20, 36, 0.06)',
	DN700A: 'rgba(13, 20, 36, 0.14)',
	DN600A: 'rgba(13, 20, 36, 0.18)',
	DN500A: 'rgba(13, 20, 36, 0.29)',
	DN400A: 'rgba(13, 20, 36, 0.36)',
	DN300A: 'rgba(13, 20, 36, 0.40)',
	DN200A: 'rgba(13, 20, 36, 0.47)',
	DN100A: 'rgba(13, 20, 36, 0.53)',
	DN90A: 'rgba(13, 20, 36, 0.63)',
	DN80A: 'rgba(13, 20, 36, 0.73)',
	DN70A: 'rgba(13, 20, 36, 0.78)',
	DN60A: 'rgba(13, 20, 36, 0.81)',
	DN50A: 'rgba(13, 20, 36, 0.85)',
	DN40A: 'rgba(13, 20, 36, 0.89)',
	DN30A: 'rgba(13, 20, 36, 0.92)',
	DN20A: 'rgba(13, 20, 36, 0.95)',
	DN10A: 'rgba(13, 20, 36, 0.97)',

	// Text color
	T30: '#292A2E',

	// Lime
	L50: '#94C748',
	L75: '#B3DF72',
};

// ---------------------------------------------------------------------------
// Helper: build a string literal node for a color value
// ---------------------------------------------------------------------------
function colorLiteral(j: core.JSCodeshift, value: string) {
	return j.stringLiteral(value);
}

// ---------------------------------------------------------------------------
// Helper: collect all import declarations that match the given source paths
// ---------------------------------------------------------------------------
function findImportDecls(
	j: core.JSCodeshift,
	source: ReturnType<typeof j>,
	importPaths: string[],
) {
	return source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) =>
			importPaths.includes(path.node.source.value as string),
		);
}

// ---------------------------------------------------------------------------
// Step 1 – Handle `import { colors } from '@atlaskit/theme'`
//           and replace `colors.<COLOR>` member-expression usages.
// ---------------------------------------------------------------------------
function replaceColorsNamespaceFromTheme(
	j: core.JSCodeshift,
	source: ReturnType<typeof j>,
): boolean {
	let changed = false;

	const themeImports = findImportDecls(j, source, ['@atlaskit/theme']);

	// Collect all local names bound to the `colors` named export
	const localNames: string[] = [];

	themeImports.forEach((path) => {
		path.node.specifiers?.forEach((specifier) => {
			if (
				j.ImportSpecifier.check(specifier) &&
				specifier.imported.name === 'colors' &&
				specifier.local
			) {
				localNames.push(specifier.local.name);
			}
		});
	});

	if (localNames.length === 0) {
		return changed;
	}

	// Replace `<localName>.<COLOR>` with the hex literal
	localNames.forEach((localName) => {
		source
			.find(j.MemberExpression, {
				object: { type: 'Identifier', name: localName },
			})
			.filter((path) => {
				const prop = path.node.property;
				return (
					j.Identifier.check(prop) &&
					Object.prototype.hasOwnProperty.call(COLOR_MAP, prop.name)
				);
			})
			.replaceWith((path) => {
				const colorName = (path.node.property as core.Identifier).name;
				changed = true;
				return colorLiteral(j, COLOR_MAP[colorName]);
			});
	});

	// Remove the `colors` specifier from the import (or the whole declaration if empty)
	if (changed) {
		themeImports.forEach((path) => {
			const specifiers = path.node.specifiers ?? [];
			const remaining = specifiers.filter(
				(s) => !(j.ImportSpecifier.check(s) && s.imported.name === 'colors'),
			);
			if (remaining.length === 0) {
				j(path).remove();
			} else {
				path.node.specifiers = remaining;
			}
		});
	}

	return changed;
}

// ---------------------------------------------------------------------------
// Step 2 – Handle `import * as colors from '@atlaskit/theme/colors'`
//           and `import colors from '@atlaskit/theme/colors'`  (namespace / default)
//           Replace `colors.<COLOR>` member-expression usages.
// ---------------------------------------------------------------------------
function replaceColorsObjectImport(
	j: core.JSCodeshift,
	source: ReturnType<typeof j>,
): boolean {
	let changed = false;

	const colorsImports = findImportDecls(j, source, ['@atlaskit/theme/colors']);

	// Collect local names from namespace (*) imports and default imports
	const localNames: string[] = [];

	colorsImports.forEach((path) => {
		path.node.specifiers?.forEach((specifier) => {
			if (
				(j.ImportNamespaceSpecifier.check(specifier) ||
					j.ImportDefaultSpecifier.check(specifier)) &&
				specifier.local
			) {
				localNames.push(specifier.local.name);
			}
		});
	});

	if (localNames.length === 0) {
		return changed;
	}

	localNames.forEach((localName) => {
		source
			.find(j.MemberExpression, {
				object: { type: 'Identifier', name: localName },
			})
			.filter((path) => {
				const prop = path.node.property;
				return (
					j.Identifier.check(prop) &&
					Object.prototype.hasOwnProperty.call(COLOR_MAP, prop.name)
				);
			})
			.replaceWith((path) => {
				const colorName = (path.node.property as core.Identifier).name;
				changed = true;
				return colorLiteral(j, COLOR_MAP[colorName]);
			});
	});

	// Remove the namespace/default specifier (or the whole declaration if empty)
	if (changed) {
		colorsImports.forEach((path) => {
			const specifiers = (path.node.specifiers ?? []).filter(
				(s) => !(j.ImportNamespaceSpecifier.check(s) || j.ImportDefaultSpecifier.check(s)),
			);
			if (specifiers.length === 0) {
				j(path).remove();
			} else {
				path.node.specifiers = specifiers;
			}
		});
	}

	return changed;
}

// ---------------------------------------------------------------------------
// Step 3 – Handle named color imports from either package:
//   import { R50, B400 } from '@atlaskit/theme/colors';
//   import { R50, B400 } from '@atlaskit/theme';   (less common but valid)
//
//   Replace every identifier reference with the hex literal and remove specifier.
// ---------------------------------------------------------------------------
function replaceNamedColorImports(
	j: core.JSCodeshift,
	source: ReturnType<typeof j>,
): boolean {
	let changed = false;

	const colorImports = findImportDecls(j, source, [
		'@atlaskit/theme/colors',
		'@atlaskit/theme',
	]);

	// Map from local binding name → hex value, plus track which import path → specifier name
	// so we can remove only the relevant specifiers.
	const localToHex: Record<string, string> = {};
	// Track which specifiers we should remove: (importPath, importedName)
	const toRemove: Array<{ path: ASTPath<ImportDeclaration>; localName: string }> = [];

	colorImports.forEach((path) => {
		path.node.specifiers?.forEach((specifier) => {
			if (j.ImportSpecifier.check(specifier)) {
				const importedName = specifier.imported.name;
				if (Object.prototype.hasOwnProperty.call(COLOR_MAP, importedName)) {
					const localName = specifier.local?.name ?? importedName;
					localToHex[localName] = COLOR_MAP[importedName];
					toRemove.push({ path, localName });
				}
			}
		});
	});

	if (Object.keys(localToHex).length === 0) {
		return changed;
	}

	// Replace each reference to the bound name (but NOT in import statements or
	// as a property key in a member expression e.g. `someObj.R50`)
	Object.entries(localToHex).forEach(([localName, hex]) => {
		source
			.find(j.Identifier, { name: localName })
			.filter((path) => {
				const parentNode = path.parent?.node;
				const parentType = parentNode?.type;
				// Skip import specifier nodes
				if (
					parentType === 'ImportSpecifier' ||
					parentType === 'ImportDefaultSpecifier' ||
					parentType === 'ImportNamespaceSpecifier'
				) {
					return false;
				}
				// Skip when used as a non-computed property key in a member expression
				// e.g. `foo.R50` — here R50 is the property, not a reference to the binding
				if (parentType === 'MemberExpression' && parentNode.property === path.node && !parentNode.computed) {
					return false;
				}
				// Skip object property keys (shorthand is fine, but `{ R50: value }` key should not be replaced)
				if (parentType === 'Property' && parentNode.key === path.node && !parentNode.computed && !parentNode.shorthand) {
					return false;
				}
				return true;
			})
			.replaceWith(() => {
				changed = true;
				return colorLiteral(j, hex);
			});
	});

	// Remove matched specifiers from their import declarations
	if (changed) {
		// Group by path to process each declaration once
		const pathsToProcess = new Set(toRemove.map((x) => x.path));
		const localNamesToRemove = new Set(toRemove.map((x) => x.localName));

		pathsToProcess.forEach((declPath) => {
			const remaining = (declPath.node.specifiers ?? []).filter((s) => {
				if (j.ImportSpecifier.check(s)) {
					return !localNamesToRemove.has(s.local?.name ?? s.imported.name);
				}
				return true;
			});
			if (remaining.length === 0) {
				j(declPath).remove();
			} else {
				declPath.node.specifiers = remaining;
			}
		});
	}

	return changed;
}

// ---------------------------------------------------------------------------
// Main transformer
// ---------------------------------------------------------------------------
export default function transformer(fileInfo: FileInfo, { jscodeshift: j }: API, options: Options): string {
	const source = j(fileInfo.source);

	const hasThemeImport =
		source
			.find(j.ImportDeclaration)
			.filter(
				(path: ASTPath<ImportDeclaration>) =>
					path.node.source.value === '@atlaskit/theme' ||
					path.node.source.value === '@atlaskit/theme/colors',
			).length > 0;

	if (!hasThemeImport) {
		return fileInfo.source;
	}

	const changed =
		replaceColorsNamespaceFromTheme(j, source) ||
		replaceColorsObjectImport(j, source) ||
		replaceNamedColorImports(j, source);

	if (!changed) {
		return fileInfo.source;
	}

	return source.toSource(options.printOptions || { quote: 'single' });
}
