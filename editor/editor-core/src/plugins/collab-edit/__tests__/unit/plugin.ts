import { CollabEditProvider } from '@atlaskit/editor-common';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

// Editor plugins
import collabEditPlugin from '../../';

describe('collab-edit: plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (
    doc: any,
    providerFactory?: any,
    sendDataOnViewUpdated?: boolean,
  ) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add([
        collabEditPlugin,
        {
          allowUnsupportedContent: true,
          sendDataOnViewUpdated,
        },
      ]),
      providerFactory,
    });
  };

  const providerMock = {
    send: jest.fn(),
    on() {
      return this;
    },
    initialize() {},
    unsubscribeAll() {},
  };

  const collabEditProviderPromise = Promise.resolve(
    // @ts-ignore
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

    expect(providerMock.send).toBeCalled();
  });

  describe.each<[boolean, number]>([
    [false, 1],
    [true, 0],
  ])('when sendDataOnViewUpdated is %p', (sendDataOnViewUpdated, times) => {
    it('should call send function for EditorState apply', async () => {
      const providerFactory = ProviderFactory.create({
        collabEditProvider: collabEditProviderPromise,
      });

      const { editorView } = editor(
        doc(p('')),
        providerFactory,
        sendDataOnViewUpdated,
      );

      const tr = editorView.state.tr
        .insertText('123')
        .setMeta('collabInitialised', true);

      editorView.state.apply(tr);
      await collabEditProviderPromise;

      expect(providerMock.send).toHaveBeenCalledTimes(times);
    });
  });
});
