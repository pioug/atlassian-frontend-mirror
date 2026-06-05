import type { ExtensionAutoConvertHandler, ExtensionManifest } from './types/extension-manifest';
import type { Parameters } from './types/extension-parameters';

export async function getAutoConvertPatternsFromModule<T extends Parameters>(
	extensions: ExtensionManifest<T>[],
): Promise<ExtensionAutoConvertHandler[]> {
	const items = await Promise.all(
		extensions.map((manifest) => {
			if (manifest.modules.autoConvert && manifest.modules.autoConvert.url) {
				return manifest.modules.autoConvert.url;
			}

			return [];
		}),
	);

	return ([] as ExtensionAutoConvertHandler[]).concat(...items);
}
