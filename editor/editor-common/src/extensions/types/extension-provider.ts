import {
  ExtensionAutoConvertHandler,
  ExtensionKey,
  ExtensionManifest,
  ExtensionType,
} from './extension-manifest';
import { Parameters } from './extension-parameters';

export interface ExtensionProvider<T extends Parameters = any> {
  getExtensions(): Promise<ExtensionManifest<T>[]>;
  getExtension(
    type: ExtensionType,
    key: ExtensionKey,
  ): Promise<ExtensionManifest<T> | undefined>;
  search(keyword: string): Promise<ExtensionManifest<T>[]>;
  getAutoConverter(): Promise<ExtensionAutoConvertHandler[]>;
}
