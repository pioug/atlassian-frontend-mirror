import { readFileSync } from 'fs';

import * as ts from 'typescript';

import type { DetectedBarrel } from '../../scripts/types';
import { inferValueKind } from '../infer-value-kind';
import { resolveRelativeImport } from '../resolve-relative-import';

type ParsedSymbol = DetectedBarrel['symbols'][number];

/**
 * A local binding introduced by an import, and whether it was bound to the source
 * module's default export. Barrels routinely do `import Foo from './foo'` and then
 * `export { Foo }`, which publishes a named symbol that is a default export at source.
 */
type ImportBinding = {
	sourceFilePath: string;
	isDefault: boolean;
};

export function parseFileSymbols(filePath: string): ParsedSymbol[] {
	const content = readSource(filePath);
	if (!content) {
		return [];
	}

	const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
	const importSources = collectImportSources(sourceFile, filePath);
	const symbols: ParsedSymbol[] = [];

	for (const statement of sourceFile.statements) {
		symbols.push(...parseExportStatement(statement, filePath, importSources));
	}

	return dedupeSymbols(symbols);
}

function parseExportStatement(
	statement: ts.Statement,
	filePath: string,
	importSources: Map<string, ImportBinding>,
): ParsedSymbol[] {
	if (ts.isExportDeclaration(statement)) {
		return parseExportDeclaration(statement, filePath, importSources);
	}

	if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
		return [parseDefaultExportAssignment(statement, importSources)];
	}

	if (hasExportModifier(statement)) {
		return parseInlineExport(statement, filePath);
	}

	return [];
}

function parseExportDeclaration(
	statement: ts.ExportDeclaration,
	filePath: string,
	importSources: Map<string, ImportBinding>,
): ParsedSymbol[] {
	const isTypeOnly = statement.isTypeOnly;
	const moduleSpecifier = getModuleSpecifierText(statement);
	const resolvedFrom =
		moduleSpecifier === null ? null : resolveRelativeImport(filePath, moduleSpecifier);

	if (!statement.exportClause) {
		return [];
	}

	if (ts.isNamespaceExport(statement.exportClause)) {
		const exportName = statement.exportClause.name.text;
		return [
			{
				exportName,
				localName: exportName,
				kind: 'value',
				sourceFilePath: resolvedFrom,
			},
		];
	}

	if (!ts.isNamedExports(statement.exportClause)) {
		return [];
	}

	const results: ParsedSymbol[] = [];
	for (const element of statement.exportClause.elements) {
		const exportName = element.name.text;
		const referencedName = element.propertyName?.text ?? exportName;
		// Without a module specifier the clause re-exports a local binding, so the name
		// inside the source module comes from how that binding was imported.
		const binding = resolvedFrom === null ? importSources.get(referencedName) : undefined;

		results.push({
			exportName,
			localName: binding?.isDefault ? 'default' : referencedName,
			kind: isTypeOnly || element.isTypeOnly ? 'type' : inferValueKind(exportName),
			sourceFilePath: resolvedFrom ?? binding?.sourceFilePath ?? null,
		});
	}

	return results;
}

function parseDefaultExportAssignment(
	statement: ts.ExportAssignment,
	importSources: Map<string, ImportBinding>,
): ParsedSymbol {
	if (ts.isIdentifier(statement.expression)) {
		const referencedName = statement.expression.text;
		const binding = importSources.get(referencedName);
		return {
			exportName: 'default',
			localName: binding && !binding.isDefault ? referencedName : 'default',
			kind: inferValueKind(referencedName),
			sourceFilePath: binding?.sourceFilePath ?? null,
		};
	}

	return {
		exportName: 'default',
		localName: 'default',
		kind: 'component',
		sourceFilePath: null,
	};
}

function parseInlineExport(statement: ts.Statement, filePath: string): ParsedSymbol[] {
	const isDefault = hasDefaultModifier(statement);

	if (ts.isFunctionDeclaration(statement) && statement.name) {
		const name = statement.name.text;
		const exportName = isDefault ? 'default' : name;
		return [
			{
				exportName,
				localName: exportName,
				kind: inferValueKind(name),
				sourceFilePath: filePath,
			},
		];
	}

	if (ts.isClassDeclaration(statement) && statement.name) {
		const name = statement.name.text;
		const exportName = isDefault ? 'default' : name;
		return [
			{
				exportName,
				localName: exportName,
				kind: 'component',
				sourceFilePath: filePath,
			},
		];
	}

	if (ts.isVariableStatement(statement)) {
		return parseExportedVariables(statement, filePath, isDefault);
	}

	if (ts.isTypeAliasDeclaration(statement) || ts.isInterfaceDeclaration(statement)) {
		return [
			{
				exportName: statement.name.text,
				localName: statement.name.text,
				kind: 'type',
				sourceFilePath: filePath,
			},
		];
	}

	if (ts.isEnumDeclaration(statement)) {
		return [
			{
				exportName: statement.name.text,
				localName: statement.name.text,
				kind: 'value',
				sourceFilePath: filePath,
			},
		];
	}

	return [];
}

function parseExportedVariables(
	statement: ts.VariableStatement,
	filePath: string,
	isDefault: boolean,
): ParsedSymbol[] {
	const results: ParsedSymbol[] = [];
	for (const declaration of statement.declarationList.declarations) {
		if (!ts.isIdentifier(declaration.name)) {
			continue;
		}
		const name = declaration.name.text;
		const exportName = isDefault ? 'default' : name;
		results.push({
			exportName,
			localName: exportName,
			kind: inferValueKind(name),
			sourceFilePath: filePath,
		});
		if (isDefault) {
			break;
		}
	}
	return results;
}

function collectImportSources(
	sourceFile: ts.SourceFile,
	filePath: string,
): Map<string, ImportBinding> {
	const importSources = new Map<string, ImportBinding>();

	for (const statement of sourceFile.statements) {
		if (!ts.isImportDeclaration(statement)) {
			continue;
		}
		if (!ts.isStringLiteral(statement.moduleSpecifier)) {
			continue;
		}
		if (!statement.importClause) {
			continue;
		}

		const resolved = resolveRelativeImport(filePath, statement.moduleSpecifier.text);
		if (!resolved) {
			continue;
		}

		if (statement.importClause.name) {
			importSources.set(statement.importClause.name.text, {
				sourceFilePath: resolved,
				isDefault: true,
			});
		}

		const namedBindings = statement.importClause.namedBindings;
		if (!namedBindings || !ts.isNamedImports(namedBindings)) {
			continue;
		}

		for (const element of namedBindings.elements) {
			importSources.set(element.name.text, {
				sourceFilePath: resolved,
				isDefault: element.propertyName?.text === 'default',
			});
		}
	}

	return importSources;
}

function hasExportModifier(statement: ts.Statement): boolean {
	const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
	if (!modifiers) {
		return false;
	}
	return modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
}

function hasDefaultModifier(statement: ts.Statement): boolean {
	const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
	if (!modifiers) {
		return false;
	}
	return modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword);
}

function getModuleSpecifierText(statement: ts.ExportDeclaration): string | null {
	if (!statement.moduleSpecifier || !ts.isStringLiteral(statement.moduleSpecifier)) {
		return null;
	}
	return statement.moduleSpecifier.text;
}

function readSource(filePath: string): string | null {
	try {
		return readFileSync(filePath, 'utf8');
	} catch {
		return null;
	}
}

function dedupeSymbols(symbols: ParsedSymbol[]): ParsedSymbol[] {
	const byName = new Map<string, ParsedSymbol>();
	for (const symbol of symbols) {
		const existing = byName.get(symbol.exportName);
		if (!existing) {
			byName.set(symbol.exportName, symbol);
			continue;
		}
		if (existing.kind !== 'type' && symbol.kind === 'type') {
			byName.set(symbol.exportName, symbol);
		}
	}
	return Array.from(byName.values());
}
