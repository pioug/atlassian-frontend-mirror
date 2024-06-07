// eslint-disable-next-line import/no-extraneous-dependencies
import {
	type Symbol,
	type SourceFile,
	type TypeAliasDeclaration,
	type ImportDeclaration,
} from 'ts-morph';

const getNames = (symbol: Symbol) => {
	const name = symbol.getName();
	return [name, symbol.getAliasedSymbol()?.getName() ?? name];
};

const getDeclaration = (symbol: Symbol) => {
	const declaration = symbol.getDeclarations()[0];
	if (!declaration) {
		throw new Error('Could not find declaration for symbol: ' + symbol.getName());
	}
	return declaration;
};

/**
 * @param {Symbol} componentSymbol is the component symbol declared in
 *     the component index file. e.g.
 *     export type { SimpleTagProps as TagProps } from './tag/__generated__/index.partial';
 * @param {SourceFile} sourceFile is the source file of the component prop symbol
 *     that was extracted from the component index file.
 * @return {Symbol} the base component symbol that is defined in the source file.
 */
const getBaseComponentSymbol = (componentSymbol: Symbol, sourceFile: SourceFile) => {
	const symbol = sourceFile.getExportSymbols().find((symbol) => {
		// The base component symbol can be aliased, so we need to check both the
		// symbol name and the aliased symbol name.
		return getNames(componentSymbol).includes(symbol.getName());
	});
	if (!symbol) {
		throw new Error(
			'Could not find base component symbol for component: ' + componentSymbol.getName(),
		);
	}
	return symbol;
};

/**
 * from the base component prop symbol, extract other relevant type declarations.
 * For example, the base component prop symbol declaration might look like:
 *
 * export type ButtonProps = Pick<
 * PlatformButtonProps,
 * 'onFocus' | 'spacing' | 'testId' | 'shouldFitContainer' | 'appearance' | 'type'>
 *
 * This function will extract the PlatformButtonProps type declaration.
 */
const getDependentTypeDeclarations = (baseComponentPropSymbol: Symbol, sourceFile: SourceFile) => {
	return sourceFile.getTypeAliases().reduce((declarations, typeAlias) => {
		const typeAliasName = typeAlias.getName();
		if (
			typeAliasName !== baseComponentPropSymbol.getName() &&
			getDeclaration(baseComponentPropSymbol).getText().includes(typeAliasName)
		) {
			declarations.push(typeAlias);
		}
		return declarations;
	}, [] as Array<TypeAliasDeclaration>);
};

/**
 * if the import is:
 *   import DefaultBox, { Box as PlatformBox } from '@atlaskit/primitives';
 * extract:
 *  {
 *    default: 'DefaultBox',
 *    named: ['PlatformBox']
 *  }
 */
const getImportedNames = (importDeclaration: ImportDeclaration) => {
	return {
		default: importDeclaration.getDefaultImport()?.getText() ?? null,
		named: importDeclaration
			.getNamedImports()
			.map((specifier) => {
				return specifier.getAliasNode()?.getText() ?? specifier.getName();
			})
			.filter((name) => !!name) as string[],
	};
};

const isTokenUsed = (token: string, codes: string[]) => {
	const check = new RegExp(`\\b${token}\\b`);
	return codes.some((code) => check.test(code));
};

/**
 * implement a custom ImportDeclaration object that allows remove named import
 * and re-generate the modified import statement.
 * This is for solving the edge case raised from DynamicTableProps.
 */
class ImportDeclarationProxy {
	private readonly base: ImportDeclaration;

	private removedNamedImports = new Set<string>();

	constructor(base: ImportDeclaration) {
		this.base = base;
	}

	public removeNamedImport(namedImport: string) {
		const target = this.base
			.getNamedImports()
			.find((tar) => [tar.getName(), tar.getAliasNode()?.getText()].includes(namedImport));
		if (target) {
			this.removedNamedImports.add(namedImport);
		}
	}

	public getText() {
		const code = this.base.getText();
		const match = code.match(/^(import |import type ){(.+)} from ['"](.+)['"];$/);
		if (!match) {
			return this.base.getText();
		}
		let [_, importStatement, importedNames, packageName] = match;
		importedNames = importedNames.trim();

		if (isSharedUIKit2TypesImport(this.base)) {
			packageName = './types.codegen';
		}
		if (this.removedNamedImports.size > 0) {
			importedNames = importedNames!
				.split(',')
				.map((text) => text.trim())
				.filter((text) => !this.removedNamedImports.has(text))
				.join(', ');
		}
		return `${importStatement}{ ${importedNames} } from '${packageName}';`;
	}
}

const isSharedUIKit2TypesImport = (importDeclaration: ImportDeclaration) => {
	return (
		importDeclaration.isTypeOnly() && importDeclaration.getModuleSpecifierValue() === '../../types'
	);
};

const extractImportDeclarations = (
	sourceFile: SourceFile,
	componentPropSymbol: Symbol,
	dependentTypeDeclarations: TypeAliasDeclaration[],
) => {
	const componentDeclarationCode = getDeclaration(componentPropSymbol).getText();

	const targetCodes = [
		componentDeclarationCode,
		...dependentTypeDeclarations.map((typeAlias) => typeAlias.getText()).filter((code) => !!code),
	];
	return sourceFile
		.getImportDeclarations()
		.filter((declaration) => {
			const moduleSpecifier = declaration.getModuleSpecifierValue();
			// only keep dependencies from
			// - @atlaskit
			// - react
			// - or '../../types'
			return (
				moduleSpecifier.startsWith('@atlaskit/') ||
				moduleSpecifier === 'react' ||
				isSharedUIKit2TypesImport(declaration)
			);
		})
		.reduce<ImportDeclarationProxy[]>((declarations, declaration) => {
			// further filter out the the imports that are not used in the component specified.
			const importedNames = getImportedNames(declaration);
			const declarationProxy = new ImportDeclarationProxy(declaration);
			let used = false;
			if (importedNames.default && isTokenUsed(importedNames.default, targetCodes)) {
				used = true;
			}
			importedNames.named.forEach((namedImport) => {
				if (isTokenUsed(namedImport, targetCodes)) {
					used = true;
				} else {
					declarationProxy.removeNamedImport(namedImport);
				}
			});
			if (used) {
				declarations.push(declarationProxy);
			}
			return declarations;
		}, []);
};

const getTypeDeclarationCodeFromImport = (
	sourceFile: SourceFile,
	packageName: string,
	typeName: string,
) => {
	const importDeclaration = sourceFile.getImportDeclarationOrThrow(packageName);
	const importSpecifier = importDeclaration
		.getNamedImports()
		.find(
			(specifier) =>
				specifier.getName() === typeName || specifier.getAliasNode()?.getText() === typeName,
		);
	const importTypeSymbol = importSpecifier?.getSymbol()?.getAliasedSymbol();
	if (!importTypeSymbol) {
		throw new Error(`Could not find type for ${typeName} in ${packageName}`);
	}
	const importSourcePath = importTypeSymbol
		.getDeclarations()[0]
		.getType()
		.getText()
		.match(/import\("(.+)"\)/)?.[1];
	if (!importSourcePath) {
		throw new Error(`Could not find import source for ${typeName} in ${packageName}`);
	}

	const importSource = sourceFile.getProject().addSourceFileAtPath(importSourcePath + '.ts');
	try {
		const typeDeclarationCode = importSource
			.getExportSymbols()
			.find(
				(symbol) =>
					symbol.getName() === typeName || symbol.getName() === importTypeSymbol.getName(),
			)
			?.getDeclarations()[0]
			?.getText();
		if (!typeDeclarationCode) {
			return null;
		}
		if (importTypeSymbol.getName() !== typeName) {
			return `${typeDeclarationCode}
type ${typeName} = ${importTypeSymbol.getName()};
`;
		}
		return typeDeclarationCode;
	} finally {
		sourceFile.getProject().removeSourceFile(importSource);
	}
};

/**
 * resolve types that are not part of the ADS components, and generate them
 * locally. As we want to make sure that the package only depends on ADS
 * types and not on any other package types.
 */
const resolveExternalTypesCode = (
	sourceFile: SourceFile,
	componentPropSymbol: Symbol,
	dependentTypeDeclarations: TypeAliasDeclaration[],
) => {
	// resolve types from @atlassian/forge-ui-types
	const forgeUITypesImports = sourceFile.getImportDeclarations().filter((declaration) => {
		const moduleSpecifier = declaration.getModuleSpecifierValue();
		return moduleSpecifier === '@atlassian/forge-ui-types';
	});
	if (forgeUITypesImports.length === 0) {
		return null;
	}

	// only the type name that are used in the component prop type should be
	// resolved
	const targetImportedTypeNames = forgeUITypesImports.reduce<string[]>(
		(importedTypeNames, imports) => {
			const names = getImportedNames(imports);
			const targetCodes = [
				getDeclaration(componentPropSymbol).getText(),
				...dependentTypeDeclarations.map((typeAlias) => typeAlias.getText()),
			];
			[names.default, ...names.named].forEach((importName) => {
				if (
					importName &&
					!importedTypeNames.includes(importName) &&
					isTokenUsed(importName, targetCodes)
				) {
					importedTypeNames.push(importName);
				}
			});
			return importedTypeNames;
		},
		[],
	);
	const declarationCode = targetImportedTypeNames
		.map((typeName) => {
			return getTypeDeclarationCodeFromImport(sourceFile, '@atlassian/forge-ui-types', typeName);
		})
		.filter((code) => !!code)
		.join('\n');

	return !!declarationCode ? declarationCode : null;
};

type CodeConsolidator = (context: {
	sourceFile: SourceFile;
	importCode?: string | null;
	externalTypesCode?: string | null;
	dependentTypeCode?: string | null;
	componentPropCode?: string | null;
}) => string;

const consolidateCodeSections: CodeConsolidator = ({
	importCode,
	externalTypesCode,
	dependentTypeCode,
	componentPropCode,
}) => {
	return [importCode, externalTypesCode, dependentTypeCode, componentPropCode]
		.filter((code) => !!code)
		.join('\n\n');
};

const baseGenerateComponentPropTypeSourceCode = (
	componentPropSymbol: Symbol,
	sourceFile: SourceFile,
	customConsolidator?: CodeConsolidator,
) => {
	// 1) extract the prop types from the source file
	const baseComponentPropSymbol = getBaseComponentSymbol(componentPropSymbol, sourceFile);

	// 2) from the prop type code further extract other relevant types in the source file
	const dependentTypeDeclarations = getDependentTypeDeclarations(
		baseComponentPropSymbol,
		sourceFile,
	);

	// 3) extract the import statement
	const importDeclarations = extractImportDeclarations(
		sourceFile,
		baseComponentPropSymbol,
		dependentTypeDeclarations,
	);

	// 4) resolve other types definition (not part of the ADS components)
	const externalTypesCode = resolveExternalTypesCode(
		sourceFile,
		baseComponentPropSymbol,
		dependentTypeDeclarations,
	);

	// 5) generate the source file
	const importCode = importDeclarations.map((declaration) => declaration.getText()).join('\n');
	const dependentTypeCode = dependentTypeDeclarations
		.map((typeAlias) => typeAlias.getText())
		.join('\n');
	const componentPropCode = getDeclaration(baseComponentPropSymbol).getText();

	return (customConsolidator ?? consolidateCodeSections)({
		sourceFile,
		importCode,
		externalTypesCode,
		dependentTypeCode,
		componentPropCode,
	});
};

const boxPropsCodeConsolidator: CodeConsolidator = ({
	sourceFile,
	importCode,
	externalTypesCode,
	dependentTypeCode,
	componentPropCode,
}) => {
	const xcssValidator = sourceFile.getVariableDeclarationOrThrow('xcssValidator').getText();

	const utilsFile = sourceFile
		.getProject()
		.addSourceFileAtPath(require.resolve('@atlassian/forge-ui/utils/xcssValidate'));
	try {
		const xcssValidatorDeclarationCode = utilsFile.getEmitOutput({
			emitOnlyDtsFiles: true,
		}).compilerObject.outputFiles[0].text;
		const xcssValidatorVariableDeclarationCode = [
			xcssValidatorDeclarationCode,
			`const ${xcssValidator};`,
		].join('\n');

		return [
			'/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */',
			importCode,
			xcssValidatorVariableDeclarationCode,
			externalTypesCode,
			dependentTypeCode,
			componentPropCode,
		]
			.filter((code) => !!code)
			.join('\n\n');
	} finally {
		sourceFile.getProject().removeSourceFile(utilsFile);
	}
};

const codeConsolidators: Record<string, CodeConsolidator> = {
	BoxProps: boxPropsCodeConsolidator,
};

const generateComponentPropTypeSourceCode = (
	componentPropSymbol: Symbol,
	sourceFile: SourceFile,
) => {
	return baseGenerateComponentPropTypeSourceCode(
		componentPropSymbol,
		sourceFile,
		codeConsolidators[componentPropSymbol.getName()],
	);
};

export { generateComponentPropTypeSourceCode };
