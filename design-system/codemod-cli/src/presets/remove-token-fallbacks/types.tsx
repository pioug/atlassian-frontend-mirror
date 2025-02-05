import { ASTPath, ImportDeclaration, Options, VariableDeclarator } from 'jscodeshift';

export interface ReplacementDetail {
	teamInfo: TeamInfo;
	filePath: string;
	lineNumber: number;
	tokenKey: string;
	rawFallbackValue: string;
	resolvedTokenValue: string;
	resolvedFallbackValue: string;
	difference?: number;
}

export interface TransformationDetails {
	replaced: ReplacementDetail[];
	notReplaced: ReplacementDetail[];
}

export type TeamInfo = {
	packageName: string;
	teamName: string;
};

export type RemoveTokenFallbackOptions = Options & {
	useLegacyColorTheme?: boolean;
	reportFolder?: string;
	addEslintComments?: boolean;
	forceUpdate?: boolean;
};

export type WithResolvedDeclarations = {
	resolvedImportDeclaration?: ASTPath<ImportDeclaration>;
	resolvedLocalVarDeclaration?: ASTPath<VariableDeclarator>;
};

export type FallbackResolveResult = WithResolvedDeclarations & {
	rawFallbackValue: string;
	fallbackValue: string | undefined;
};

export type WithStart = { start?: number };

export type TokenProcessingResult = WithResolvedDeclarations & {
	fallbackRemoved: boolean;
};
