import React from 'react';
import { getExampleExtensionProviders } from '../example-helpers/get-example-extension-providers';
import { default as FullPageExample } from './5-full-page';

import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import { default as EditorContext } from '../src/ui/EditorContext';
import type EditorActions from '../src/actions';
import { usePresetContext } from '../src/presets/context';

type StackPlugins = [OptionalPlugin<ExtensionPlugin>];
const Comp = () => {
  const editorApi = usePresetContext<StackPlugins>();
  const editorProps = React.useMemo(() => {
    return {
      extensionProviders: (editorActions: EditorActions | undefined) => [
        getExampleExtensionProviders(editorApi, editorActions),
      ],
      allowExtension: { allowAutoSave: false },
    };
  }, [editorApi]);

  return <FullPageExample editorProps={editorProps} />;
};

export default function Example() {
  return (
    <EditorContext>
      <Comp />
    </EditorContext>
  );
}
