import React from 'react';

import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';

import { getExampleExtensionProviders } from '../example-helpers/get-example-extension-providers';
import type { EditorActions } from '../src';
import { usePresetContext } from '../src/presets/context';
import { default as EditorContext } from '../src/ui/EditorContext';

import { default as FullPageExample } from './5-full-page';

type StackPlugins = [OptionalPlugin<ExtensionPlugin>];
const Comp = () => {
  const editorApi = usePresetContext<StackPlugins>();
  const editorProps = React.useMemo(() => {
    return {
      macroProvider: undefined,
      extensionProviders: (editorActions?: EditorActions) => [
        getExampleExtensionProviders(editorApi, editorActions),
      ],
      allowExtension: {
        allowAutoSave: true,
        allowExtendFloatingToolbars: true,
      },
      elementBrowser: {
        showModal: true,
        replacePlusMenu: true,
        helpUrl:
          'https://support.atlassian.com/confluence-cloud/docs/what-are-macros/',
      },
      insertMenuItems: [],
      allowFragmentMark: true,
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
