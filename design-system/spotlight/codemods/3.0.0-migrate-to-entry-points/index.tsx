/**
 * Codemod: migrate-to-entry-points
 *
 * Migrates imports from the `@atlaskit/spotlight` barrel (index) to their
 * dedicated entry-points.
 *
 * Background: every named export has moved to a sub-path entry-point such as
 * `@atlaskit/spotlight/card`, `@atlaskit/spotlight/popover-content`, etc.
 * After this migration the barrel `index.tsx` (the `.` export) can be removed
 * entirely — there are no symbols left in the root entry-point.
 *
 * Usage (via @atlaskit/codemod-cli, resolves from node_modules):
 *   npx @atlaskit/codemod-cli --packages @atlaskit/spotlight@2.1.1 <path-to-your-source>
 */
import type { API, FileInfo } from 'jscodeshift';

// Tell jscodeshift to use the TSX parser so `import type` syntax is supported.
export const parser = 'tsx';

// ---------------------------------------------------------------------------
// Mapping: exported symbol → sub-path entry-point
// ---------------------------------------------------------------------------
//
// Values are the package sub-path (e.g. "card" → import from
// "@atlaskit/spotlight/card").
//
// This map is derived directly from `src/index.tsx` (the barrel) cross-checked
// against `package.json` `exports` and each `src/entry-points/*.tsx` file.
//
// Symbols that stay in the root entry-point (`@atlaskit/spotlight`) are listed
// in ROOT_SYMBOLS below. For spotlight this set is empty — every barrel export
// has a dedicated entry-point, so the barrel can be deleted after migration.

const SYMBOL_TO_ENTRY_POINT: Record<string, string> = {
	// Card
	SpotlightCard: 'card',
	SpotlightCardProps: 'card',

	// Body
	SpotlightBody: 'body',
	SpotlightBodyProps: 'body',

	// Header
	SpotlightHeader: 'header',
	SpotlightHeaderProps: 'header',

	// Headline
	SpotlightHeadline: 'headline',
	SpotlightHeadlineProps: 'headline',

	// Footer
	SpotlightFooter: 'footer',
	SpotlightFooterProps: 'footer',

	// Actions
	SpotlightActions: 'actions',
	SpotlightActionsProps: 'actions',

	// Step count
	SpotlightStepCount: 'step-count',
	SpotlightStepCountProps: 'step-count',

	// Primary action / link
	SpotlightPrimaryAction: 'primary-action',
	SpotlightPrimaryActionProps: 'primary-action',
	SpotlightPrimaryLink: 'primary-link',
	SpotlightPrimaryLinkProps: 'primary-link',

	// Secondary action / link
	SpotlightSecondaryAction: 'secondary-action',
	SpotlightSecondaryActionProps: 'secondary-action',
	SpotlightSecondaryLink: 'secondary-link',
	SpotlightSecondaryLinkProps: 'secondary-link',

	// Controls
	SpotlightControls: 'controls',
	SpotlightControlsProps: 'controls',
	SpotlightDismissControl: 'dismiss-control',
	SpotlightDismissControlProps: 'dismiss-control',
	SpotlightShowMoreControl: 'show-more-control',
	SpotlightShowMoreControlProps: 'show-more-control',

	// Media
	SpotlightMedia: 'media',
	SpotlightMediaProps: 'media',

	// Popover
	PopoverProvider: 'popover-provider',
	PopoverContent: 'popover-content',
	PopoverContentProps: 'popover-content',
	PopoverTarget: 'popover-target',

	// Misc
	UNSAFE_UpdateOnChange: 'update-on-change',
	usePreloadMedia: 'use-preload-media',

	// Type-only exports (from `./types`)
	Placement: 'types',
	DismissEvent: 'types',
};

// Symbols that remain in the root `@atlaskit/spotlight` entry-point.
// Empty for spotlight — the barrel is fully migrated and can be removed.
const ROOT_SYMBOLS = new Set<string>([]);

const SPOTLIGHT_PACKAGE = '@atlaskit/spotlight';

export default function transformer(file: FileInfo, api: API): string {
	const j = api.jscodeshift;
	const source = j(file.source);

	// Find all import declarations from '@atlaskit/spotlight'
	const spotlightImports = source.find(j.ImportDeclaration, {
		source: { value: SPOTLIGHT_PACKAGE },
	});

	if (spotlightImports.length === 0) {
		return file.source;
	}

	let fileHasChanges = false;

	spotlightImports.forEach((path) => {
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
			const entrySource = `${SPOTLIGHT_PACKAGE}/${entryPoint}`;

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
		} else {
			// Remove the original declaration entirely (all symbols migrated)
			j(path).remove();
		}

		// Insert new import declarations after the (now possibly removed) original.
		// We insert them before the next sibling, or at the end of imports.
		// Use the path's parent to insert after it.
		if (keepInRoot.length > 0) {
			// Insert after the updated root import
			j(path).insertAfter(newImports.reverse());
		} else {
			// The original was removed; find the last import to insert after it,
			// or prepend to body if there are no other imports.
			const allImports = source.find(j.ImportDeclaration);
			if (allImports.length > 0) {
				j(allImports.at(allImports.length - 1).get()).insertAfter(newImports.reverse());
			} else {
				// No imports left — prepend to body
				const body = source.find(j.Program).get('body');
				newImports.reverse().forEach((decl) => body.value.unshift(decl));
			}
		}
	});

	return fileHasChanges ? source.toSource({ useTabs: true, quote: 'single' }) : file.source;
}
