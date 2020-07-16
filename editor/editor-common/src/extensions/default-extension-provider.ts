import { getAutoConvertPatternsFromModule } from './module-helpers';
import {
  ExtensionAutoConvertHandler,
  ExtensionKey,
  ExtensionManifest,
  ExtensionProvider,
  ExtensionType,
} from './types';

export default class DefaultExtensionProvider implements ExtensionProvider {
  private manifestsPromise: Promise<ExtensionManifest[]>;
  private autoConvertHandlers?: ExtensionAutoConvertHandler[];

  constructor(
    manifests: ExtensionManifest[] | Promise<ExtensionManifest[]>,
    /**
     * Allows for an optional list of pre compiled auto convert handlers to be passed.
     * Useful for performance improvements or to support legacy converters.
     *
     * Warning: If this attribute is passed, this provider will ignore auto convert patterns from the manifests.
     */
    autoConvertHandlers?: ExtensionAutoConvertHandler[],
  ) {
    this.manifestsPromise = Promise.resolve(manifests);
    this.autoConvertHandlers = autoConvertHandlers;
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

  async getAutoConverter() {
    if (this.autoConvertHandlers) {
      return this.autoConvertHandlers;
    }

    const autoConverters = getAutoConvertPatternsFromModule(
      await this.manifestsPromise,
    );

    return autoConverters;
  }
}
