import React from 'react';
import {
  ProviderFactoryProvider,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import { createEditorExampleForTests } from '../example-helpers/create-editor-example-for-tests';
import {
  EditorPresetCXHTML,
  EditorPresetCXHTMLProps,
} from '../src/labs/next/presets/cxhtml';
import { FullPage } from '../src/labs/next/full-page';
import { EditorProps } from '../src/labs/next/Editor';

type ExampleProps = {
  preset: EditorPresetCXHTMLProps;
  editor: EditorProps;
};

export default function EditorExampleForIntegrationTests() {
  return createEditorExampleForTests<ExampleProps>(
    (props, { providers }, lifecycleHandlers) => {
      const providerFactory = ProviderFactory.create(providers || {});
      return (
        <ProviderFactoryProvider value={providerFactory}>
          <EditorPresetCXHTML {...props.preset}>
            <FullPage {...props.editor} {...lifecycleHandlers} />
          </EditorPresetCXHTML>
        </ProviderFactoryProvider>
      );
    },
    {},
  );
}
