import React from 'react';

import { HyperlinkAddToolbar } from '@atlaskit/editor-common/link';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies, @atlassian/tangerine/import/entry-points
import { MockLinkPickerPlugin } from '@atlaskit/editor-test-helpers/src/integration/components/example-helpers/link-picker/mock-plugin';

const createEditorView = () =>
  new EditorView(null, { state: createEditorState(doc(p())) });

export function HyperlinkFloatingToolbar() {
  return (
    <HyperlinkAddToolbar
      lpLinkPicker={true}
      providerFactory={new ProviderFactory()}
      linkPickerOptions={{
        plugins: [new MockLinkPickerPlugin()],
      }}
      onSubmit={() => {}}
      view={createEditorView()}
      hyperlinkPluginState={undefined}
    />
  );
}

export function HyperlinkFloatingToolbarEmpty() {
  return (
    <HyperlinkAddToolbar
      lpLinkPicker={true}
      providerFactory={new ProviderFactory()}
      onSubmit={() => {}}
      view={createEditorView()}
      hyperlinkPluginState={undefined}
    />
  );
}

export function HyperlinkFloatingToolbarDeprecated() {
  return (
    <HyperlinkAddToolbar
      lpLinkPicker={false}
      providerFactory={new ProviderFactory()}
      hyperlinkPluginState={{
        timesViewed: 0,
        inputMethod: undefined,
        searchSessionId: '',
        canInsertLink: true,
      }}
      onSubmit={() => {}}
      view={createEditorView()}
    />
  );
}
