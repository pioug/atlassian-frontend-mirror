import * as fs from 'fs';
import path from 'path';

import * as ts from 'typescript';

interface ExtractedAfExportData {
  newRelativeFilePath: string;
  newAfExportKey: string;
  newAfExportValue: string;
  atlaskitImportName: string;
  absoluteFilePath: string;
}

interface FileData {
  newRelativeFilePath: string;
  fileContent: string;
}

interface NewAfExportData {
  newAfExportKey: string;
  newAfExportValue: string;
}

export interface EntryPointData {
  fileData: FileData;
  afExportData: NewAfExportData;
  atlaskitImportName: string;
}

function getAfExports(folderPath: string) {
  const packageJsonPath = path.join(folderPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const afExports = packageJson['af:exports'];
  if (!afExports) {
    throw new Error(
      `Could not find af:exports in package.json at ${packageJsonPath}`,
    );
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
  const sourceFile = ts.createSourceFile(
    fileName,
    fileContents,
    ts.ScriptTarget.Latest,
    true,
  );

  const statements = sourceFile.statements.map(statement => {
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
  const wholeExportNameRegex = new RegExp(`\\b${exportName}\\b`);
  const statement = statements.find(
    statement =>
      wholeExportNameRegex.test(statement) && statement.startsWith('export'),
  );
  return (
    (statement?.startsWith('export type') ||
      statement?.startsWith('export interface') ||
      statement?.includes(`type ${exportName}`)) ??
    false
  );
}

function createExportStatementsForAfExport(
  importName: string,
  filePath: string,
) {
  const { variableExports, typeExports } =
    findExportedVariablesAndTypes(filePath);

  let exportStatements = [
    '// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.',
  ];

  if (variableExports.length > 0) {
    const variableExportStatement = `export { ${variableExports.join(
      ', ',
    )} } from '${importName}';`;
    exportStatements.push(variableExportStatement);
  }

  if (typeExports.length > 0) {
    const typeExportStatement = `export type { ${typeExports.join(
      ', ',
    )} } from '${importName}';`;
    exportStatements.push(typeExportStatement);
  }

  return exportStatements.join('\n');
}

export function findExportedVariablesAndTypes(fileName: string) {
  const exportNames = getFileExportNames(fileName);
  const statements = getFileTopLevelStatements(fileName);
  const variableExports: string[] = [];
  const typeExports: string[] = [];
  exportNames.forEach(exportName => {
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
  const sourceFile = ts.createSourceFile(
    fileName,
    sourceCode,
    ts.ScriptTarget.Latest,
  );

  // Function to traverse the AST
  const visit = (node: ts.Node) => {
    if (ts.isExportDeclaration(node)) {
      const exportClause = node.exportClause;
      if (exportClause && ts.isNamedExports(exportClause)) {
        exportClause.elements.forEach(exportedElement => {
          exports.push(exportedElement.name.text);
        });
      }
    } else if (
      ts.isTypeAliasDeclaration(node) ||
      ts.isInterfaceDeclaration(node) ||
      ts.isEnumDeclaration(node)
    ) {
      if (
        node.modifiers?.some(
          modifier => modifier.kind === ts.SyntaxKind.ExportKeyword,
        )
      ) {
        exports.push(node.name.text);
      }
    } else if (ts.isVariableStatement(node)) {
      if (
        node.modifiers?.some(
          modifier => modifier.kind === ts.SyntaxKind.ExportKeyword,
        )
      ) {
        node.declarationList.declarations.forEach(declaration => {
          if (ts.isIdentifier(declaration.name)) {
            exports.push(declaration.name.text);
          }
        });
      }
    } else if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
      if (
        node.modifiers?.some(
          modifier => modifier.kind === ts.SyntaxKind.ExportKeyword,
        ) &&
        node.name
      ) {
        exports.push(node.name.text);
      }
    } else if (ts.isExportAssignment(node)) {
      if (ts.isIdentifier(node.expression)) {
        exports.push(node.expression.text);
      }
    }

    ts.forEachChild(node, visit);
  };

  // Start traversing
  visit(sourceFile);

  return exports;
}

export function getEntryPointDataForPlugin(
  pluginPath: string,
): EntryPointData[] {
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
