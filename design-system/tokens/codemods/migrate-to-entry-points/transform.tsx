/**
 * Codemod: migrate-to-entry-points
 *
 * Migrates imports from the `@atlaskit/tokens` barrel (index) to their
 * dedicated entry-points.
 *
 * Background: the barrel `index.tsx` now only exports `token`. All other
 * named exports have moved to sub-path entry-points such as
 * `@atlaskit/tokens/get-token-value`, `@atlaskit/tokens/constants`, etc.
 *
 * Usage:
 *   npx @hypermod/cli --packages @atlaskit/tokens@<version> --preset migrate-to-entry-points <path>
 */
import type { API, FileInfo } from 'jscodeshift';

// Tell jscodeshift to use the TSX parser so `import type` syntax is supported.
export const parser = 'tsx';

// ---------------------------------------------------------------------------
// Mapping: exported symbol → sub-path entry-point
// ---------------------------------------------------------------------------
//
// Values are the package sub-path (e.g. "constants" → import from
// "@atlaskit/tokens/constants").
//
// Symbols that stay in the root entry-point (`@atlaskit/tokens`) are listed
// in ROOT_SYMBOLS below.

const SYMBOL_TO_ENTRY_POINT: Record<string, string> = {
	// Value exports
	getTokenValue: 'get-token-value',
	setGlobalTheme: 'set-global-theme',
	enableGlobalTheme: 'enable-global-theme',
	getThemeStyles: 'get-theme-styles',
	getThemeHtmlAttrs: 'get-theme-html-attrs',
	getSSRAutoScript: 'get-ssr-auto-script',
	useThemeObserver: 'use-theme-observer',
	ThemeMutationObserver: 'theme-mutation-observer',
	getGlobalTheme: 'get-global-theme',
	themeStringToObject: 'theme-state-transformer',
	themeObjectToString: 'theme-state-transformer',
	themeConfig: 'theme-config',
	themeImportMap: 'artifacts/theme-import-map',

	// Constants
	COLOR_MODE_ATTRIBUTE: 'constants',
	CURRENT_SURFACE_CSS_VAR: 'constants',
	SUBTREE_THEME_ATTRIBUTE: 'constants',
	THEME_DATA_ATTRIBUTE: 'constants',

	// Type-only exports
	CSSToken: 'token-names',
	CSSTokenMap: 'token-names',
	ActiveTokens: 'artifacts/types',
	ThemeColorModes: 'theme-config',
	ThemeContrastModes: 'theme-config',
	Themes: 'theme-config',
	ThemeFileNames: 'theme-config',
	ThemeIds: 'theme-config',
	ThemeOptionsSchema: 'theme-config',
	ThemeState: 'theme-config',
	ActiveThemeState: 'theme-config',
	FontFamilyToken: 'types',
	FontWeightToken: 'types',
	Groups: 'types',
	OpacityToken: 'types',
	PaintToken: 'types',
	RawToken: 'types',
	ShadowToken: 'types',
	SpacingToken: 'types',
	ShapeToken: 'types',
	TypographyToken: 'types',
	MotionToken: 'types',
};

// Symbols that remain in the root `@atlaskit/tokens` entry-point.
const ROOT_SYMBOLS = new Set(['token']);

const TOKENS_PACKAGE = '@atlaskit/tokens';

export default function transformer(file: FileInfo, api: API): string {
	// Skip generated/prebuilt/dist files — they should not be modified by this codemod.
	if (/\/(prebuilt|dist|node_modules)\//.test(file.path)) {
		return file.source;
	}

	const j = api.jscodeshift;
	const source = j(file.source);

	// Find all import declarations from '@atlaskit/tokens'
	const tokenImports = source.find(j.ImportDeclaration, {
		source: { value: TOKENS_PACKAGE },
	});

	if (tokenImports.length === 0) {
		return file.source;
	}

	let fileHasChanges = false;

	tokenImports.forEach((path) => {
		const specifiers = path.node.specifiers ?? [];

		// Separate specifiers into those that stay and those that must migrate
		const keepInRoot: typeof specifiers = [];
		// Map of entry-point → specifiers that belong there
		const byEntryPoint = new Map<string, typeof specifiers>();

		for (const specifier of specifiers) {
			if (
				specifier.type === 'ImportDefaultSpecifier' ||
				specifier.type === 'ImportNamespaceSpecifier'
			) {
				// Default / namespace imports stay in root (unlikely but handle gracefully)
				keepInRoot.push(specifier);
				continue;
			}

			if (specifier.type !== 'ImportSpecifier') {
				keepInRoot.push(specifier);
				continue;
			}

			const importedName =
				specifier.imported.type === 'Identifier'
					? specifier.imported.name
					: (specifier.imported as any).value;

			if (ROOT_SYMBOLS.has(importedName)) {
				keepInRoot.push(specifier);
				continue;
			}

			const entryPoint = SYMBOL_TO_ENTRY_POINT[importedName];

			if (!entryPoint) {
				// Unknown symbol — leave it in root and let TS catch it
				keepInRoot.push(specifier);
				continue;
			}

			const group = byEntryPoint.get(entryPoint) ?? [];
			group.push(specifier);
			byEntryPoint.set(entryPoint, group);
		}

		if (byEntryPoint.size === 0) {
			// Nothing to migrate in this import declaration
			return;
		}

		fileHasChanges = true;

		// Determine whether the original declaration used `import type`
		const isTypeImport = (path.node as any).importKind === 'type';

		// Collect new import declarations to insert
		const newImports: ReturnType<typeof j.importDeclaration>[] = [];

		// Build one import declaration per entry-point
		byEntryPoint.forEach((specs, entryPoint) => {
			const entrySource = `${TOKENS_PACKAGE}/${entryPoint}`;

			// Determine importKind for the new declaration.
			// If the original was `import type` everything is a type import.
			// Otherwise check if every specifier has importKind === 'type'.
			let allTypes = isTypeImport;
			if (!isTypeImport) {
				allTypes = specs.every(
					(s) => s.type === 'ImportSpecifier' && (s as any).importKind === 'type',
				);
			}

			// Clone specifiers, stripping per-specifier `type` keyword if the whole
			// declaration will be `import type` (avoids redundant `import type { type X }`)
			const clonedSpecs = specs.map((s) => {
				if (s.type !== 'ImportSpecifier') return s;
				const importedName = (s.imported as any).name ?? (s.imported as any).value;
				const hasAlias = s.local && s.local.name !== importedName;
				const cloned = hasAlias
					? j.importSpecifier(j.identifier(importedName), j.identifier(s.local!.name))
					: j.importSpecifier(j.identifier(importedName));
				// Preserve per-specifier type annotation when the declaration isn't type-only
				if (!allTypes && (s as any).importKind === 'type') {
					(cloned as any).importKind = 'type';
				}
				return cloned;
			});

			const newDecl = j.importDeclaration(clonedSpecs, j.stringLiteral(entrySource));
			if (allTypes) {
				(newDecl as any).importKind = 'type';
			}
			newImports.push(newDecl);
		});

		// Update original declaration to only keep root symbols
		if (keepInRoot.length > 0) {
			path.node.specifiers = keepInRoot;
			// Insert new sub-path imports immediately after the (now trimmed) root import
			j(path).insertAfter(newImports.reverse());
		} else {
			// All symbols migrated — insert new imports at the original position
			// by inserting before the original node, then removing it.
			// Preserve any leading comments (e.g. /* eslint-disable ... */) from
			// the original node onto the first replacement node so recast doesn't drop them.
			const leadingComments = (path.node as any).comments?.filter((c: any) => c.leading);
			if (leadingComments?.length) {
				const firstNew = newImports[0];
				(firstNew as any).comments = [...leadingComments, ...((firstNew as any).comments ?? [])];
				// Clear from original so they aren't printed twice
				(path.node as any).comments = (path.node as any).comments.filter((c: any) => !c.leading);
			}
			j(path).insertBefore(newImports);
			j(path).remove();
		}
	});

	return fileHasChanges ? source.toSource({ useTabs: true, quote: 'single' }) : file.source;
}
