import { ASTPath, ImportDeclaration, Options } from 'jscodeshift';

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

export type FallbackResolveResult = {
	rawFallbackValue: string;
	fallbackValue: string | undefined;
	resolvedImportDeclaration?: ASTPath<ImportDeclaration>;
};
