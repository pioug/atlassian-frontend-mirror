import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';

import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import memoizeOne from 'memoize-one';
import EditorActions from '../actions';
import { ExtensionProvidersProp } from '../types/editor-props';

function prepareExtensionProvidersInternal(
  editorActions: EditorActions,
  extensionProviders?: ExtensionProvidersProp,
): ExtensionProvider | undefined {
  if (!extensionProviders) {
    return;
  }

  if (typeof extensionProviders === 'function') {
    return combineExtensionProviders(extensionProviders(editorActions));
  }

  return combineExtensionProviders(extensionProviders);
}

const prepareExtensionProvider = (
  getEditorActions: () => EditorActions,
): ((
  extensionProviders?: ExtensionProvidersProp,
) => ExtensionProvider | undefined) =>
  memoizeOne((extensionProviders) =>
    prepareExtensionProvidersInternal(getEditorActions(), extensionProviders),
  );

export default prepareExtensionProvider;
