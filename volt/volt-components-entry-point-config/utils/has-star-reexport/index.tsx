import { readFileSync } from 'fs';

import * as ts from 'typescript';

/**
 * Whether the file re-exports another module wholesale (a star / ExportAllDeclaration re-export).
 *
 * The symbol parser only reads a single file and does not follow these, so a file
 * containing one has an incomplete export list and cannot be soundly validated.
 */
export function hasStarReexport(filePath: string): boolean {
	let content: string;
	try {
		content = readFileSync(filePath, 'utf8');
	} catch {
		return false;
	}

	const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

	return sourceFile.statements.some(
		(statement) =>
			ts.isExportDeclaration(statement) && statement.moduleSpecifier && !statement.exportClause,
	);
}
