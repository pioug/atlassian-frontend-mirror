import { Extension, ExtensionHandler } from '../extensions/types';

export function getExtensionRenderer<T>(
  extensionHandler: Extension<T> | ExtensionHandler<T>,
): ExtensionHandler<T> {
  if (typeof extensionHandler === 'object') {
    return extensionHandler.render;
  } else {
    return extensionHandler;
  }
}
