import React from 'react';
import {
  ProviderFactoryProvider,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import { createEditorExampleForTests } from '../example-helpers/create-editor-example-for-tests';
import { EditorPresetMobile, MobilePresetProps } from '../src/labs-next';
import { Mobile } from '../src/labs/next/mobile';
import { EditorProps } from '../src/labs/next/Editor';

type ExampleProps = {
  preset: MobilePresetProps;
  editor: EditorProps;
};

export default function EditorExampleForIntegrationTests() {
  return createEditorExampleForTests<ExampleProps>(
    (props, { providers }, lifecycleHandlers) => {
      const providerFactory = ProviderFactory.create(providers || {});
      return (
        <ProviderFactoryProvider value={providerFactory}>
          <EditorPresetMobile {...props.preset}>
            <Mobile {...props.editor} {...lifecycleHandlers} />
          </EditorPresetMobile>
        </ProviderFactoryProvider>
      );
    },
    {},
  );
}
