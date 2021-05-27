import { ProviderFactory } from '@atlaskit/editor-common';

import {
  typeAheadPluginKey,
  TypeAheadPluginState,
} from '@atlaskit/editor-core';

import {
  doc,
  p,
  typeAheadQuery,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

import { MentionProvider } from '@atlaskit/mention/resource';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';

import { androidComposeStart, androidComposeEnd } from '../../_utils';
import { EditorViewWithComposition } from '../../../../types';

describe('mentions on mobile', () => {
  const createEditor = createEditorFactory<TypeAheadPluginState>();

  const mentionProvider: Promise<MentionProvider> = Promise.resolve(
    mentionResourceProvider,
  );

  const editor = (
    doc: DocBuilder,
  ): {
    editorView: EditorViewWithComposition;
    plugin: any;
  } => {
    const { editorView, plugin } = createEditor({
      doc,
      editorProps: { mentionProvider },
      providerFactory: ProviderFactory.create({ mentionProvider }),
      pluginKey: typeAheadPluginKey,
    });

    return {
      editorView: editorView as EditorViewWithComposition,
      plugin,
    };
  };

  beforeEach(() => jest.useFakeTimers());

  it('should trigger mention query on compositionend', async () => {
    const { editorView, plugin } = editor(doc(p()));

    // mutate DOM to final state
    editorView.dom.innerHTML = '@';

    // start/end composition
    androidComposeStart(editorView, '@');
    expect(editorView.composing).toBeTruthy();
    androidComposeEnd(editorView, '@');

    jest.runOnlyPendingTimers();

    const pluginState = plugin.getState(editorView.state);

    expect(pluginState.active).toBe(true);
    expect(pluginState.query).toEqual('');

    expect(editorView.state.doc).toEqualDocument(
      doc(p(typeAheadQuery({ trigger: '@' })('@'))),
    );
  });
});
