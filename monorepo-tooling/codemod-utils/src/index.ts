export {
	createRenameFuncFor,
	createConvertFuncFor,
	createRenameImportFor,
	createRemoveFuncFor,
	replaceImportStatementFor,
	elevateComponentToNewEntryPoint,
	createTransformer,
	renameNamedImportWithAliasName,
	flattenCertainChildPropsAsProp,
	createRenameJSXFunc,
	createRemoveFuncAddCommentFor,
	changeImportEntryPoint,
} from './utils';

export {
	getDefaultSpecifier,
	getNamedSpecifier,
	getJSXAttributesByName,
	hasJSXAttributesByName,
	doesIdentifierExist,
	hasImportDeclaration,
	hasImportDeclarationFromAnyPackageEntrypoint,
	addCommentBefore,
	addCommentToStartOfFile,
	callExpressionArgMatchesString,
	testMethodVariantEach,
	getSafeImportName,
	removeImport,
	getDynamicImportName,
	addDynamicImport,
	tryCreateImport,
	addToImport,
} from './utils/support';

export type { API, FileInfo, Options, JSCodeshift, Collection, Node } from 'jscodeshift';
