import React, { useMemo } from 'react';

import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import EditorActions from '@atlaskit/editor-core/src/actions';
import { usePresetContext } from '@atlaskit/editor-core/src/presets/context';
import { default as EditorContext } from '@atlaskit/editor-core/src/ui/EditorContext';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension';
import { getConfluenceMacrosExtensionProvider } from '@atlaskit/editor-test-helpers/example-helpers';

import ConfigPanelWithExtensionPicker from '../example-utils/config-panel/ConfigPanelWithExtensionPicker';

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
