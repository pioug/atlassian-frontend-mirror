import type { changeImportEntryPoint } from '@atlaskit/codemod-utils';

export type EntryPointChangeRequest = {
	importSpecifiers: string[];
	oldEntryPointsToRemove: string[];
	newEntryPoint: string;
	shouldBeTypeImport: boolean;
};

export type EntryPointChange = ReturnType<typeof changeImportEntryPoint>;

export type EntryPointChangeMigrates = EntryPointChange[];
