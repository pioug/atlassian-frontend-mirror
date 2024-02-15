import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import type {
  OptionalPlugin,
  PublicPluginAPI,
} from '@atlaskit/editor-common/types';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';

import type EditorActions from '../src/actions';

import { getConfluenceMacrosExtensionProvider } from './confluence-macros';
import { getXProductExtensionProvider } from './fake-x-product-extensions';

export const getExampleExtensionProviders = (
  api: PublicPluginAPI<[OptionalPlugin<ExtensionPlugin>]> | undefined,
  editorActions?: EditorActions,
) =>
  combineExtensionProviders([
    getXProductExtensionProvider(),
    getConfluenceMacrosExtensionProvider(api, editorActions),
  ]);
