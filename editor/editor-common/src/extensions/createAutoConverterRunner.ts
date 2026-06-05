import type { ExtensionAutoConvertHandler } from './types/extension-manifest';

export const createAutoConverterRunner =
	(autoConvertHandlers: ExtensionAutoConvertHandler[]): ExtensionAutoConvertHandler =>
	(text: string) => {
		for (const handler of autoConvertHandlers) {
			const result = handler(text);

			if (result) {
				return result;
			}
		}
	};
