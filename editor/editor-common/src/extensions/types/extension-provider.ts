import {
  ExtensionManifest,
  ExtensionType,
  ExtensionKey,
} from './extension-manifest';

export interface ExtensionProvider {
  getExtensions(): Promise<ExtensionManifest[]>;
  getExtension(
    type: ExtensionType,
    key: ExtensionKey,
  ): Promise<ExtensionManifest | undefined>;
  search(keyword: string): Promise<ExtensionManifest[]>;
}
