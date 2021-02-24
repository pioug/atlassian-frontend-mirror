import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import EditorActions from '../src/actions';
import { getConfluenceMacrosExtensionProvider } from './confluence-macros';
import { getXProductExtensionProvider } from './fake-x-product-extensions';

export const getExampleExtensionProviders = (editorActions?: EditorActions) =>
  combineExtensionProviders([
    getXProductExtensionProvider(),
    getConfluenceMacrosExtensionProvider(editorActions),
  ]);
