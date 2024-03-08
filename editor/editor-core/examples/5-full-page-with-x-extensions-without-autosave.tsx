import React from 'react';

import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import { getExampleExtensionProviders } from '@atlaskit/editor-test-helpers/example-helpers';

import type EditorActions from '../src/actions';
import { usePresetContext } from '../src/presets/context';
import { default as EditorContext } from '../src/ui/EditorContext';

import { default as FullPageExample } from './5-full-page';

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
