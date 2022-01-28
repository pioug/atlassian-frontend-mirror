import {
  ExtensionManifest,
  DefaultExtensionProvider,
} from '@atlaskit/editor-common/extensions';
import { getConfluenceMobileMacroManifests } from '@atlaskit/legacy-mobile-macros';
import { createPromise } from '../cross-platform-promise';
import { eventDispatcher } from '../renderer/dispatcher';

export function createExtensionProvider(enableConfluenceMobileMacros: boolean) {
  let manifests: Promise<ExtensionManifest[]> = Promise.resolve([]);
  if (enableConfluenceMobileMacros) {
    manifests = Promise.all([
      manifests,
      getConfluenceMobileMacroManifests(createPromise, eventDispatcher),
    ]).then((nested) => nested.flat());
  }

  return Promise.resolve(new DefaultExtensionProvider(manifests, []));
}
