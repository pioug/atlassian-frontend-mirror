import {
  ExtensionManifest,
  ExtensionProvider,
  ExtensionType,
  ExtensionKey,
} from './types';

export default class DefaultExtensionProvider implements ExtensionProvider {
  private manifestsPromise: Promise<ExtensionManifest[]>;

  constructor(manifests: ExtensionManifest[] | Promise<ExtensionManifest[]>) {
    this.manifestsPromise = Promise.resolve(manifests);
  }

  getExtensions() {
    return this.manifestsPromise;
  }

  async getExtension(type: ExtensionType, key: ExtensionKey) {
    const extension = (await this.manifestsPromise).find(
      manifest => manifest.type === type && manifest.key === key,
    );

    if (!extension) {
      throw new Error(
        `Extension with type "${type}" and key "${key}" not found!`,
      );
    }

    return extension;
  }

  async search(keyword: string) {
    const extensions = (await this.manifestsPromise).filter(manifest =>
      manifest.title.toLowerCase().includes(keyword.toLowerCase()),
    );
    return extensions;
  }
}
