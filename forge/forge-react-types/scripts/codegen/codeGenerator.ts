/* eslint-disable @typescript-eslint/ban-types */
// eslint-disable-next-line import/no-extraneous-dependencies
import {
	type Symbol,
	type SourceFile,
	type TypeAliasDeclaration,
	type ImportDeclaration,
	type TypeReferenceNode,
	type VariableDeclaration,
	SyntaxKind,
	Node,
} from 'ts-morph';
// eslint-disable-next-line import/no-extraneous-dependencies
import kebabCase from 'lodash/kebabCase';
import {
	serializeTypeReferenceWithPickType,
	extractPickKeys,
	extractOmitKeys,
} from './typeSerializer';
import {
	findTypeReferenceFromUnionOrIntersect,
	getTypeNodeFromSymbol,
	makePickOrOmitPredicate,
} from './utils';

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
	const allTypeAliases = sourceFile.getTypeAliases();
	const [usedTypes, otherTypes] = allTypeAliases.reduce(
		(agg, typeAlias) => {
			if (typeAlias.getName() === baseComponentPropSymbol.getName()) {
				agg[0].push(typeAlias);
			} else {
				agg[1].push(typeAlias);
			}
			return agg;
		},
		[[], []] as [TypeAliasDeclaration[], TypeAliasDeclaration[]],
	);

	const [dependentTypes] = extractDependentTypeDeclarations(usedTypes, otherTypes);
	return dependentTypes;
};

/**
 * recursively extract dependent type declarations from the current types and candidate types.
 */
const extractDependentTypeDeclarations = (
	currentTypes: TypeAliasDeclaration[],
	candidateTypes: TypeAliasDeclaration[],
): [TypeAliasDeclaration[], TypeAliasDeclaration[]] => {
	const dependentTypesSet: Set<TypeAliasDeclaration> = new Set();
	for (const typeAlias of currentTypes) {
		const typeAliasDeclarationText = typeAlias.getText();
		for (const candidateType of candidateTypes) {
			if (typeAliasDeclarationText.includes(candidateType.getName())) {
				dependentTypesSet.add(candidateType);
			}
		}
	}
	if (dependentTypesSet.size === 0) {
		return [[], candidateTypes];
	}
	const dependentTypes = Array.from(dependentTypesSet);
	const otherTypes = candidateTypes.filter((typeAlias) => !dependentTypesSet.has(typeAlias));
	const [nextDependentTypes, nextOtherTypes] = extractDependentTypeDeclarations(
		dependentTypes,
		otherTypes,
	);
	return [[...dependentTypes, ...nextDependentTypes], nextOtherTypes];
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

interface IImportDeclaration {
	addNamedImport: (namedImport: string) => void;
	removeNamedImport: (namedImport: string) => void;
	getText: () => string;
}

/**
 * implement a custom ImportDeclaration object that allows remove named import
 * and re-generate the modified import statement.
 * This is for solving the edge case raised from DynamicTableProps.
 */
class ImportDeclarationProxy implements IImportDeclaration {
	private readonly base: ImportDeclaration;

	private removedNamedImports = new Set<string>();

	private addedNamedImports = new Set<string>();

	constructor(base: ImportDeclaration) {
		this.base = base;
	}

	public getBasePackage() {
		return this.base.getModuleSpecifierValue();
	}

	public addNamedImport(namedImport: string) {
		if (this.removedNamedImports.has(namedImport)) {
			this.removedNamedImports.delete(namedImport);
		}
		this.addedNamedImports.add(namedImport);
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
		let importedNamesList = importedNames
			.trim()
			.split(',')
			.map((text) => text.trim());

		if (isSharedUIKit2TypesImport(this.base)) {
			packageName = './types.codegen';
		}

		if (this.removedNamedImports.size > 0) {
			importedNamesList = importedNamesList.filter((text) => !this.removedNamedImports.has(text));
		}
		if (this.addedNamedImports) {
			importedNamesList = Array.from(new Set([...importedNamesList, ...this.addedNamedImports]));
		}
		importedNames = importedNamesList.sort().join(', ');
		return `${importStatement}{ ${importedNames} } from '${packageName}';`;
	}
}

class SimpleImportDeclaration implements IImportDeclaration {
	private readonly packageName: string;

	private namedImports = new Set<string>();

	private defaultImport?: string;

	constructor(packageName: string, defaultImport?: string) {
		this.packageName = packageName;
		this.defaultImport = defaultImport;
	}

	public addNamedImport(namedImport: string) {
		this.namedImports.add(namedImport);
	}

	public removeNamedImport(namedImport: string) {
		this.namedImports.delete(namedImport);
	}

	public getText() {
		if (this.namedImports.size === 0 && !this.defaultImport) {
			return `import '${this.packageName}';`;
		}
		const importedNamesList = Array.from(this.namedImports)
			.sort()
			.map((name) => `type ${name}`);
		const importedNames =
			importedNamesList.length > 0 ? `{ ${importedNamesList.join(', ')} }` : null;
		const defaultImport = this.defaultImport ? `type ${this.defaultImport}` : null;
		return `import ${[defaultImport, importedNames].filter(Boolean).join(', ')} from '${this.packageName}';`;
	}
}

// handles type imports from platform/packages/forge/forge-ui/src/components/UIKit/types.ts
const isSharedUIKit2TypesImport = (importDeclaration: ImportDeclaration) => {
	return (
		importDeclaration.isTypeOnly() &&
		// file is a relative import
		importDeclaration.getModuleSpecifierValue().charAt(0) === '.' &&
		// file is named types
		importDeclaration.getModuleSpecifierValue().split('/').pop() === 'types'
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

const makeJSDocComment = (comment: string) => {
	const commentBody = comment
		.split('\n')
		.map((line) => line.trimEnd())
		.map((line) => (line.length === 0 ? ' *' : ` * ${line}`))
		.join('\n');
	return `/**
${commentBody}
 */`;
};

const getComponentTypeCode = (componentPropSymbol: Symbol, sourceFile: SourceFile) => {
	const propName = componentPropSymbol.getName();
	const componentName = propName.replace('Props', '');
	const targetComponent = sourceFile.getVariableDeclaration(componentName);

	const statements = [];
	if (targetComponent) {
		const comment = targetComponent
			.getVariableStatement()
			?.getJsDocs()
			.map((jsDoc) => jsDoc.getInnerText())
			.join('\n');

		if (comment && comment.length > 0) {
			let jsDocContent = comment;
			const componentDocUrl = getUIKitComponentDocUrl(componentName);
			if (componentDocUrl) {
				jsDocContent = `${comment}\n\n@see [${componentName}](${getUIKitComponentDocUrl(componentName)}) in UI Kit documentation for more information`;
			}

			statements.push(updateDACUrlInJSDocComment(makeJSDocComment(jsDocContent)));
		}
	}
	statements.push(`export type T${componentName}<T> = (props: ${propName}) => T;`);
	return statements.join('\n');
};

type CodeConsolidator = (context: {
	sourceFile: SourceFile;
	importCode?: string | null;
	externalTypesCode?: string | null;
	dependentTypeCode?: string | null;
	componentPropCode?: string | null;
	componentTypeCode?: string | null;
}) => string;

const consolidateCodeSections: CodeConsolidator = ({
	importCode,
	externalTypesCode,
	dependentTypeCode,
	componentPropCode,
	componentTypeCode,
}) => {
	return [
		'/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */',
		importCode,
		externalTypesCode,
		dependentTypeCode,
		componentPropCode,
		componentTypeCode,
	]
		.filter((code) => !!code)
		.join('\n\n');
};

const toAbsoluteDACUrl = (path: string) => `https://developer.atlassian.com${path}`;

const updateDACUrlInJSDocComment = (code: string) => {
	// regex to match markdown links in the JS doc comments
	const markdownLinkRegex = /([ \t]+\*.+\[.+\])\(([^)]+)\)/g;
	return code.replace(markdownLinkRegex, (match, p1, url) => {
		if (url.startsWith('/')) {
			return `${p1}(${toAbsoluteDACUrl(url)})`;
		}
		return match;
	});
};

const getComponentPropsTypeCode = (componentPropSymbol: Symbol) => {
	const sourceCode = getDeclaration(componentPropSymbol).getText(true);

	return updateDACUrlInJSDocComment(sourceCode);
};

// this is to map special cases, and we should later review them for better consistency
const componentPathMap: Record<string, string | false> = {
	AdfRenderer: 'adfRenderer',
	ErrorMessage: 'form/#error-message',
	HelperMessage: 'form/#helper-message',
	ValidMessage: 'form/#validation-message',
	FormHeader: 'form/#form-header',
	FormFooter: 'form/#form-footer',
	FormSection: 'form/#form-section',
	Label: 'form/#label',
	LinkButton: 'button/#linkbutton-props',
	LoadingButton: 'button/#loadingbutton-props',
	ModalBody: 'modal/#body',
	ModalFooter: 'modal/#footer',
	ModalHeader: 'modal/#header',
	ModalTitle: 'modal/#title',
	ModalTransition: 'modal/#modal-transition',
	SectionMessageAction: 'section-message/#section-message-action',
	TabsList: 'tabs',
	TabPanel: 'tabs',
	Tab: 'tabs',
	SimpleTag: 'tag',
	Grid: false,
	Bleed: false,
};

const getUIKitComponentDocUrl = (componentName: string) => {
	const matchedComponentPath = componentPathMap[componentName];
	if (matchedComponentPath === false) {
		return null;
	}
	const baseComponentPath = matchedComponentPath ?? kebabCase(componentName);
	const componentPath = baseComponentPath.includes('/#')
		? baseComponentPath
		: `${baseComponentPath}/`;

	return `/platform/forge/ui-kit/components/${componentPath}`;
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
	const componentPropCode = getComponentPropsTypeCode(baseComponentPropSymbol);

	// 6) get component type code
	const componentTypeCode = getComponentTypeCode(baseComponentPropSymbol, sourceFile);

	return (customConsolidator ?? consolidateCodeSections)({
		sourceFile,
		importCode,
		externalTypesCode,
		dependentTypeCode,
		componentPropCode,
		componentTypeCode,
	});
};

const registeredExternalTypes: Record<
	string,
	{
		package: string;
		defaultImport: string;
	}
> = {
	'^React..+$': {
		package: 'react',
		defaultImport: 'React',
	},
};

const findExternalTypeInfo = (typeName: string) => {
	return (
		Object.entries(registeredExternalTypes).find(
			([externalTypePattern]) =>
				externalTypePattern === typeName || new RegExp(externalTypePattern).test(typeName),
		)?.[1] ?? null
	);
};

// consolidate external types into import declarations
const consolidateImportDeclarations = (
	importDeclarations: ImportDeclarationProxy[],
	externalTypes: Set<string>,
): IImportDeclaration[] => {
	const declarations: IImportDeclaration[] = [...importDeclarations];
	externalTypes.forEach((typeName) => {
		const typePackage = findExternalTypeInfo(typeName);
		if (typePackage) {
			const existingImport = importDeclarations.find(
				(declaration) => declaration.getBasePackage() === typePackage.package,
			);
			if (existingImport) {
				existingImport.addNamedImport(typeName);
			} else {
				const newImport = new SimpleImportDeclaration(
					typePackage.package,
					typePackage.defaultImport,
				);
				if (!typeName.startsWith(`${typePackage.defaultImport}.`)) {
					newImport.addNamedImport(typeName);
				}
				declarations.push(newImport);
			}
		}
	});
	return declarations;
};

const extractPlatformPropsTypeDeclarationAndTargetPropertyKeys = (
	rawDependentTypeDeclarations: TypeAliasDeclaration[],
	baseComponentPropsSymbol: Symbol,
): {
	typeDeclaration: TypeAliasDeclaration;
	baseComponentPropTypeReference: TypeReferenceNode;
	omitKeys: string[];
	pickKeys: string[];
} => {
	// this pattern is used when there is special JSDoc comments override required to customize component documentation.
	// e.g. Badge component has:
	//    PlatformBadgeProps = Omit<_PlatformBadgeProps, 'children'> & {}
	//    BadgeProps = Pick<PlatformBadgeProps, 'appearance' | 'children' | 'max' | 'testId'>
	const specialPlatformPropsTypeDeclaration = rawDependentTypeDeclarations.find((declaration) =>
		declaration.getName().startsWith('_Platform'),
	);
	const mainPlatformPropsTypeDeclaration = rawDependentTypeDeclarations.find((declaration) =>
		declaration.getName().startsWith('Platform'),
	);
	if (!mainPlatformPropsTypeDeclaration && !specialPlatformPropsTypeDeclaration) {
		throw new Error(
			'Could not find Platform props type declaration from the component prop type source code',
		);
	}
	const platformPropsTypeDeclaration =
		specialPlatformPropsTypeDeclaration ?? mainPlatformPropsTypeDeclaration;

	const typeWhichPicksPlatformProps = findTypeReferenceFromUnionOrIntersect(
		getTypeNodeFromSymbol(baseComponentPropsSymbol!)!,
		makePickOrOmitPredicate('Pick', 'Platform'),
	);
	if (!typeWhichPicksPlatformProps) {
		throw new Error(
			`Could not find type which picks platform props from the component prop type source code for ${baseComponentPropsSymbol.getName()}`,
		);
	}
	const pickKeys = extractPickKeys(typeWhichPicksPlatformProps);
	let omitKeys: string[] = [];
	if (specialPlatformPropsTypeDeclaration && mainPlatformPropsTypeDeclaration) {
		const omitNode = mainPlatformPropsTypeDeclaration
			.getTypeNodeOrThrow()
			.asKindOrThrow(SyntaxKind.IntersectionType)
			.getTypeNodes()[0]
			.asKindOrThrow(SyntaxKind.TypeReference);
		// if there is a special platform props type declaration, we need
		omitKeys = extractOmitKeys(omitNode);
	}

	return {
		typeDeclaration: platformPropsTypeDeclaration!,
		baseComponentPropTypeReference: typeWhichPicksPlatformProps,
		pickKeys,
		omitKeys,
	};
};

/**
 * This function implements the new code generation logic for the component prop types.
 * Instead of referencing to the ADS component prop types, it generates the prop types
 * by serializing the ADS component prop types. Hence, it remove the dependency on the
 * ADS components.
 */
const generateComponentPropTypeSourceCodeWithSerializedType = (
	componentPropSymbol: Symbol,
	sourceFile: SourceFile,
	customConsolidator?: CodeConsolidator,
) => {
	// 1) extract the prop types from the source file
	const baseComponentPropSymbol = getBaseComponentSymbol(componentPropSymbol, sourceFile);

	// 2) from the prop type code further extract other relevant types in the source file,
	//    and separate the platform props type declaration from the rest of the dependent types.
	//    as this will be used to generate the type code.
	const rawDependentTypeDeclarations = getDependentTypeDeclarations(
		baseComponentPropSymbol,
		sourceFile,
	);
	const {
		omitKeys,
		typeDeclaration: platformPropsTypeDeclaration,
		baseComponentPropTypeReference,
	} = extractPlatformPropsTypeDeclarationAndTargetPropertyKeys(
		rawDependentTypeDeclarations,
		baseComponentPropSymbol,
	);
	const dependentTypeDeclarations = rawDependentTypeDeclarations.filter(
		(declaration) => declaration !== platformPropsTypeDeclaration,
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

	// 5) serialize the prop type for the @atlaskit component (e.g. PlatformButtonProps)
	const [typeDefCode, usedExternalTypes] = serializeTypeReferenceWithPickType(
		baseComponentPropTypeReference,
		({ jsDoc, typeCode, propertySignature }) => {
			const propertyName = propertySignature.getName();
			if (omitKeys.includes(propertyName)) {
				return {
					typeCode,
				};
			}
			return {
				jsDoc,
				typeCode,
			};
		},
	);

	// 6) generate the source file
	const importCode = consolidateImportDeclarations(importDeclarations, usedExternalTypes)
		.map((declaration) => declaration.getText())
		.join('\n');

	const platformPropsTypeDeclarationName = platformPropsTypeDeclaration?.getName();
	const dependentTypeCode = [
		...dependentTypeDeclarations.map((typeAlias) => typeAlias.getText()),
		platformPropsTypeDeclarationName &&
			`\n// Serialized type\ntype ${platformPropsTypeDeclarationName} = ${typeDefCode};`,
	]
		.filter(Boolean)
		.join('\n');

	const componentPropCode = getComponentPropsTypeCode(baseComponentPropSymbol);

	// 7) get component type code
	const componentTypeCode = getComponentTypeCode(baseComponentPropSymbol, sourceFile);

	return (customConsolidator ?? consolidateCodeSections)({
		sourceFile,
		importCode,
		externalTypesCode,
		dependentTypeCode,
		componentPropCode,
		componentTypeCode,
	});
};

/**
 * Extracts variable declarations that are referenced in the given variable declaration node.
 * This recursively finds all variable references and extracts their declarations.
 */
const extractReferencedVariables = (
	sourceFile: SourceFile,
	variableDeclaration: VariableDeclaration,
	visited: Set<string> = new Set(),
): string[] => {
	const variableDeclarations: string[] = [];
	const identifiers = new Set<string>();

	// Traverse the AST to find identifier references
	const initializer = variableDeclaration.getInitializer();
	if (initializer) {
		initializer.forEachDescendant((node) => {
			if (Node.isIdentifier(node)) {
				// Only consider identifiers that are not part of property access
				// (e.g., `obj.prop` - we want to skip `prop` but consider `obj` if it's a variable)
				const parent = node.getParent();
				const isPropertyAccess =
					Node.isPropertyAccessExpression(parent) && parent.getNameNode() === node;
				const isPropertyName = Node.isPropertyAssignment(parent) && parent.getNameNode() === node;

				if (!isPropertyAccess && !isPropertyName) {
					const identifier = node.getText();
					// Skip keywords and already visited variables
					if (
						!visited.has(identifier) &&
						![
							'const',
							'let',
							'var',
							'function',
							'return',
							'if',
							'else',
							'for',
							'while',
							'true',
							'false',
							'null',
							'undefined',
							'this',
							'super',
							'makeXCSSValidator',
						].includes(identifier)
					) {
						identifiers.add(identifier);
					}
				}
			}
		});
	}

	// Try to find variable declarations for each identifier
	for (const identifier of identifiers) {
		try {
			const referencedVar = sourceFile.getVariableDeclaration(identifier);
			if (referencedVar && !visited.has(identifier)) {
				visited.add(identifier);
				const declarationText = referencedVar.getVariableStatement()?.getText();
				if (declarationText) {
					variableDeclarations.push(declarationText);
					// Recursively extract variables referenced in this declaration
					const nestedVariables = extractReferencedVariables(sourceFile, referencedVar, visited);
					variableDeclarations.push(...nestedVariables);
				}
			}
		} catch {
			// Variable not found in this file, skip it
		}
	}

	return variableDeclarations;
};

/**
 * Extracts import declarations that are used by the given variable declarations.
 */
const extractImportsForVariables = (
	sourceFile: SourceFile,
	variableDeclarations: string[],
): string[] => {
	const importDeclarations: string[] = [];
	const allVariableCode = variableDeclarations.join('\n');

	// Get all import declarations from the source file
	const imports = sourceFile.getImportDeclarations();

	for (const importDecl of imports) {
		const moduleSpecifier = importDecl.getModuleSpecifierValue();
		// Only extract imports from @atlaskit packages (not local imports)
		if (moduleSpecifier.startsWith('@atlaskit/')) {
			const namedImports = importDecl.getNamedImports();
			const isTypeOnlyImport = importDecl.isTypeOnly();

			// Check if any of the imported names are used in the variable declarations
			const usedNamedImports: string[] = [];
			const usedTypeImports: string[] = [];

			for (const namedImport of namedImports) {
				const importName = namedImport.getAliasNode()?.getText() ?? namedImport.getName();
				if (isTokenUsed(importName, [allVariableCode])) {
					// Check if this specific import specifier is type-only
					// by checking if the import declaration text contains "type" before this import
					const importText = importDecl.getText();
					const importNamePattern = new RegExp(`\\btype\\s+${importName}\\b`);
					const isTypeOnly = isTypeOnlyImport || importNamePattern.test(importText);

					if (isTypeOnly) {
						usedTypeImports.push(importName);
					} else {
						usedNamedImports.push(importName);
					}
				}
			}

			// If any imports are used, create an import statement
			if (usedNamedImports.length > 0 || usedTypeImports.length > 0) {
				const importParts: string[] = [];
				if (usedTypeImports.length > 0) {
					importParts.push(`type { ${usedTypeImports.join(', ')} }`);
				}
				if (usedNamedImports.length > 0) {
					importParts.push(`{ ${usedNamedImports.join(', ')} }`);
				}
				if (importParts.length > 0) {
					importDeclarations.push(`import ${importParts.join(', ')} from '${moduleSpecifier}';`);
				}
			}
		}
	}

	return importDeclarations;
};

const handleXCSSProp: CodeConsolidator = ({
	sourceFile,
	importCode,
	externalTypesCode,
	dependentTypeCode,
	componentPropCode,
	componentTypeCode,
}) => {
	const xcssValidatorfile = sourceFile
		.getProject()
		.addSourceFileAtPath(require.resolve('@atlassian/forge-ui/utils/xcssValidator'));
	const xcssValidatorDeclaration = xcssValidatorfile.getVariableDeclarationOrThrow('xcssValidator');
	const xcssValidator = xcssValidatorDeclaration.getText();
	const XCSSPropType = xcssValidatorfile
		.getTypeAliasOrThrow('XCSSProp')
		.setIsExported(false)
		.getText();

	// Extract variables referenced in xcssValidator
	const referencedVariables = extractReferencedVariables(
		xcssValidatorfile,
		xcssValidatorDeclaration,
	);
	// Reverse to maintain dependency order (dependencies first)
	const referencedVariablesCode = referencedVariables.reverse().join('\n');

	// Extract imports used by the extracted variables
	const variableImports = extractImportsForVariables(xcssValidatorfile, referencedVariables);
	const variableImportsCode = variableImports.join('\n');

	const utilsFile = sourceFile
		.getProject()
		.addSourceFileAtPath(require.resolve('@atlassian/forge-ui/utils/xcssValidate'));
	try {
		const xcssValidatorDeclarationCode = utilsFile.getEmitOutput({
			emitOnlyDtsFiles: true,
		}).compilerObject.outputFiles[0].text;
		const xcssValidatorVariableDeclarationCode = [
			xcssValidatorDeclarationCode,
			variableImportsCode,
			referencedVariablesCode,
			`const ${xcssValidator};`,
			XCSSPropType,
		]
			.filter((code) => !!code)
			.join('\n');

		return [
			'/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */',
			importCode,
			xcssValidatorVariableDeclarationCode,
			externalTypesCode,
			dependentTypeCode,
			componentPropCode,
			componentTypeCode,
		]
			.filter((code) => !!code)
			.join('\n\n');
	} finally {
		sourceFile.getProject().removeSourceFile(utilsFile);
	}
};

const codeConsolidators: Record<string, CodeConsolidator> = {
	BoxProps: handleXCSSProp,
	PressableProps: handleXCSSProp,
};

const typeSerializableComponentPropSymbols = [
	'CalendarProps',
	'CheckboxProps',
	'CodeProps',
	'CodeBlockProps',
	'BadgeProps',
	'EmptyStateProps',
	'ErrorMessageProps',
	'LozengeProps',
	'HeadingProps',
	'RangeProps',
];

const generateComponentPropTypeSourceCode = (
	componentPropSymbol: Symbol,
	sourceFile: SourceFile,
) => {
	const sourceCodeGenerator = typeSerializableComponentPropSymbols.includes(
		componentPropSymbol.getName(),
	)
		? generateComponentPropTypeSourceCodeWithSerializedType
		: baseGenerateComponentPropTypeSourceCode;

	return sourceCodeGenerator(
		componentPropSymbol,
		sourceFile,
		codeConsolidators[componentPropSymbol.getName()],
	);
};

export { generateComponentPropTypeSourceCode };
