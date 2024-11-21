import type { Extension, ExtensionHandler } from '../extensions/types/extension-handler';
import type { Parameters } from '../extensions/types/extension-parameters';

export function getExtensionRenderer<T extends Parameters>(
	extensionHandler: Extension<T> | ExtensionHandler<T>,
): ExtensionHandler<T> {
	if (typeof extensionHandler === 'object') {
		return extensionHandler.render;
	} else {
		return extensionHandler;
	}
}
