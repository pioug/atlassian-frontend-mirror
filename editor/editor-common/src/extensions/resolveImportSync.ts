import type { Module } from './types/extension-manifest';
import type { ESModule } from './types/extension-manifest-common';
import type { Parameters } from './types/extension-parameters';

export const resolveImportSync = <T extends Parameters>(importedModule: Module<T>): T => {
	return importedModule && (importedModule as ESModule<T>).__esModule
		? (importedModule as ESModule<T>).default
		: (importedModule as T);
};
