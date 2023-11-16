import React, { useMemo } from 'react';
import ConfigPanelWithExtensionPicker from '../example-helpers/config-panel/ConfigPanelWithExtensionPicker';
import { getConfluenceMacrosExtensionProvider } from '../example-helpers/confluence-macros';

import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';

import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension';
import { default as EditorContext } from '../src/ui/EditorContext';
import EditorActions from '../src/actions';
import { usePresetContext } from '../src/presets/context';

type StackPlugins = [OptionalPlugin<ExtensionPlugin>];
const Comp = () => {
  const editorApi = usePresetContext<StackPlugins>();

  const macroExtensionProvider = useMemo(() => {
    return getConfluenceMacrosExtensionProvider(editorApi, new EditorActions());
  }, [editorApi]);

  const extensionProvider = combineExtensionProviders([macroExtensionProvider]);

  return (
    <ConfigPanelWithExtensionPicker extensionProvider={extensionProvider} />
  );
};

export default function Example() {
  return (
    <EditorContext>
      <Comp />
    </EditorContext>
  );
}
