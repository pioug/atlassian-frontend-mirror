import {
	type ASTPath,
	type ImportDeclaration,
	type Options,
	type VariableDeclarator,
} from 'jscodeshift';

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
	skipTokens?: string;
	preserveSkippedFallbacks?: boolean;
	skipEslint?: boolean;
	skipPrettier?: boolean;
	colorDifferenceThreshold?: number;
	spaceDifferenceThreshold?: number;
	numericDifferenceThreshold?: number;
	borderDifferenceThreshold?: number;
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
