import { CollabEditProvider } from '@atlaskit/editor-common';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { nextTick } from '@atlaskit/editor-test-helpers/next-tick';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// Editor plugins
import collabEditPlugin from '../../';

describe('collab-edit: plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder, providerFactory?: any) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add([collabEditPlugin, {}]),
      providerFactory,
    });
  };

  const providerMock = {
    send: jest.fn(),
    on() {
      return this;
    },
    off() {
      return this;
    },
    initialize() {
      return this;
    },
    unsubscribeAll() {
      return this;
    },
    sendMessage() {},
  };

  const collabEditProviderPromise = Promise.resolve(
    providerMock as CollabEditProvider,
  );

  beforeEach(() => {
    providerMock.send.mockClear();
  });

  it('should not be sending transactions through collab provider before it is ready', async () => {
    const providerFactory = ProviderFactory.create({
      collabEditProvider: collabEditProviderPromise,
    });
    const { editorView } = editor(doc(p('')), providerFactory);

    editorView.dispatch(editorView.state.tr.insertText('123'));

    await collabEditProviderPromise;
    await nextTick();

    expect(providerMock.send).not.toBeCalled();
  });

  it('should be sending transactions through collab provider when it is ready', async () => {
    const providerFactory = ProviderFactory.create({
      collabEditProvider: collabEditProviderPromise,
    });
    const { editorView } = editor(doc(p('')), providerFactory);

    editorView.dispatch(
      editorView.state.tr.scrollIntoView().setMeta('collabInitialised', true),
    );

    editorView.dispatch(editorView.state.tr.insertText('123'));
    await collabEditProviderPromise;
    await nextTick();

    expect(providerMock.send).toBeCalled();
  });

  it('should call send function for EditorState apply', async () => {
    const providerFactory = ProviderFactory.create({
      collabEditProvider: collabEditProviderPromise,
    });

    const { editorView } = editor(doc(p('')), providerFactory);

    const tr = editorView.state.tr
      .insertText('123')
      .setMeta('collabInitialised', true);

    editorView.state.apply(tr);
    await collabEditProviderPromise;
    await nextTick();

    expect(providerMock.send).toHaveBeenCalledTimes(0);
  });
});
