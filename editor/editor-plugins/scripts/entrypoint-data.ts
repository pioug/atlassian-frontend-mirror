// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as fs from 'fs';
import path from 'path';

// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as ts from 'typescript';

interface ExtractedAfExportData {
	absoluteFilePath: string;
	atlaskitImportName: string;
	newAfExportKey: string;
	newAfExportValue: string;
	newRelativeFilePath: string;
}

interface FileData {
	fileContent: string;
	newRelativeFilePath: string;
}

interface NewAfExportData {
	newAfExportKey: string;
	newAfExportValue: string;
}

export interface EntryPointData {
	afExportData: NewAfExportData;
	atlaskitImportName: string;
	fileData: FileData;
}

function getAfExports(folderPath: string) {
	const packageJsonPath = path.join(folderPath, 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

	const afExports = packageJson['af:exports'];
	if (!afExports) {
		throw new Error(`Could not find af:exports in package.json at ${packageJsonPath}`);
	}

	const folderName = path.basename(folderPath);
	const data: ExtractedAfExportData[] = [];

	for (const key in afExports) {
		if (afExports.hasOwnProperty(key)) {
			// Normalize the key
			const normalizedKey = key.startsWith('.') ? key.substring(1) : key;
			const normalizedValue = afExports[key].startsWith('.')
				? afExports[key].substring(1)
				: afExports[key];
			const shortenedFolderName = folderName.split('-').slice(2).join('-');
			const newRelativeFilePath = afExports[key].replace(
				'./src',
				path.join('src', shortenedFolderName),
			);
			data.push({
				newRelativeFilePath: newRelativeFilePath,
				newAfExportKey: './' + path.join(shortenedFolderName, normalizedKey),
				newAfExportValue: './' + newRelativeFilePath,
				atlaskitImportName: path.join('@atlaskit', folderName, normalizedKey),
				absoluteFilePath: path.join(folderPath, normalizedValue),
			});
		}
	}

	return data;
}

function getFileTopLevelStatements(fileName: string): string[] {
	const fileContents = fs.readFileSync(fileName, 'utf8');
	const sourceFile = ts.createSourceFile(fileName, fileContents, ts.ScriptTarget.Latest, true);

	const statements = sourceFile.statements.map((statement) => {
		// Using the TypeScript printer to get the full text of each top-level statement
		const printer = ts.createPrinter({
			newLine: ts.NewLineKind.LineFeed,
			removeComments: true,
		});
		return printer.printNode(ts.EmitHint.Unspecified, statement, sourceFile);
	});

	return statements;
}

function isTypeExport(exportName: string, statements: string[]): boolean {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const wholeExportNameRegex = new RegExp(`\\b${exportName}\\b`);
	const statement = statements.find(
		(statement) => wholeExportNameRegex.test(statement) && statement.startsWith('export'),
	);
	return (
		(statement?.startsWith('export type') ||
			statement?.startsWith('export interface') ||
			statement?.includes(`type ${exportName}`)) ??
		false
	);
}

function createExportStatementsForAfExport(importName: string, filePath: string) {
	const { variableExports, typeExports } = findExportedVariablesAndTypes(filePath);

	const exportStatements = [
		'// THIS FILE IS GENERATED via packages/editor/editor-plugins/scripts/update-editor-plugins.ts. DO NOT MODIFY IT MANUALLY.',
		'// Disable no-re-export rule for entry point files',
		'/* eslint-disable @atlaskit/editor/no-re-export */',
	];

	if (variableExports.length > 0) {
		const variableExportStatement = `export { ${variableExports.join(
			', ',
		)} } from '${importName}';`;
		exportStatements.push(variableExportStatement);
	}

	if (typeExports.length > 0) {
		const typeExportStatement = `export type { ${typeExports.join(', ')} } from '${importName}';`;
		exportStatements.push(typeExportStatement);
	}

	return exportStatements.join('\n');
}

export function findExportedVariablesAndTypes(fileName: string) {
	const exportNames = getFileExportNames(fileName);
	const statements = getFileTopLevelStatements(fileName);
	const variableExports: string[] = [];
	const typeExports: string[] = [];
	exportNames.forEach((exportName) => {
		if (isTypeExport(exportName, statements)) {
			typeExports.push(exportName);
		} else {
			variableExports.push(exportName);
		}
	});
	return { variableExports, typeExports };
}

function getFileExportNames(fileName: string) {
	const exports: string[] = [];

	// Read the file content
	const sourceCode = ts.sys.readFile(fileName);
	if (!sourceCode) {
		throw new Error(`Could not read file: ${fileName}`);
	}

	// Create a source file
	const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest);

	// Function to traverse the AST
	const visit = (node: ts.Node) => {
		if (ts.isExportDeclaration(node)) {
			const exportClause = node.exportClause;
			if (exportClause && ts.isNamedExports(exportClause)) {
				exportClause.elements.forEach((exportedElement) => {
					// Ignored via go/ees005
					// eslint-disable-next-line import/no-commonjs
					exports.push(exportedElement.name.text);
				});
			}
		} else if (
			ts.isTypeAliasDeclaration(node) ||
			ts.isInterfaceDeclaration(node) ||
			ts.isEnumDeclaration(node)
		) {
			if (node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
				// Ignored via go/ees005
				// eslint-disable-next-line import/no-commonjs
				exports.push(node.name.text);
			}
		} else if (ts.isVariableStatement(node)) {
			if (node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
				node.declarationList.declarations.forEach((declaration) => {
					if (ts.isIdentifier(declaration.name)) {
						// Ignored via go/ees005
						// eslint-disable-next-line import/no-commonjs
						exports.push(declaration.name.text);
					}
				});
			}
		} else if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
			if (
				node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) &&
				node.name
			) {
				// Ignored via go/ees005
				// eslint-disable-next-line import/no-commonjs
				exports.push(node.name.text);
			}
		} else if (ts.isExportAssignment(node)) {
			if (ts.isIdentifier(node.expression)) {
				// Ignored via go/ees005
				// eslint-disable-next-line import/no-commonjs
				exports.push(node.expression.text);
			}
		}

		ts.forEachChild(node, visit);
	};

	// Start traversing
	visit(sourceFile);

	return exports;
}

export function getEntryPointDataForPlugin(pluginPath: string): EntryPointData[] {
	const afExports = getAfExports(pluginPath);
	const newAfExportData: EntryPointData[] = [];

	for (const {
		newRelativeFilePath,
		newAfExportKey,
		newAfExportValue,
		atlaskitImportName,
		absoluteFilePath,
	} of afExports) {
		const exportStatements = createExportStatementsForAfExport(
			atlaskitImportName,
			absoluteFilePath,
		);
		newAfExportData.push({
			fileData: {
				newRelativeFilePath,
				fileContent: exportStatements,
			},
			afExportData: {
				newAfExportKey: newAfExportKey,
				newAfExportValue: newAfExportValue,
			},
			atlaskitImportName,
		});
	}

	return newAfExportData;
}
