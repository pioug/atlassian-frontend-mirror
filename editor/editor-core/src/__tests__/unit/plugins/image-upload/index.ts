import { ProviderFactory } from '@atlaskit/editor-common';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import createEvent from '@atlaskit/editor-test-helpers/create-event';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  doc,
  media,
  mediaSingle,
  p,
  code_block,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { setNodeSelection } from '../../../../utils';
import {
  insertExternalImage,
  startImageUpload,
} from '../../../../plugins/image-upload/pm-plugins/commands';
import { ImageUploadProvider } from '@atlaskit/editor-common/provider-factory';
import { stateKey as imageUploadPluginKey } from '../../../../plugins/image-upload/pm-plugins/plugin-key';

describe('image-upload', () => {
  const createEditor = createEditorFactory();

  const testImgSrc =
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
  const testImg = () =>
    mediaSingle()(media({ type: 'external', url: testImgSrc })());
  const editor = (doc: DocBuilder, imageUploadProvider?: any) =>
    createEditor({
      doc,
      editorProps: {
        legacyImageUploadProvider: Promise.resolve(() => {}),
        media: {
          allowMediaSingle: true,
        },
      },
      providerFactory: ProviderFactory.create({ imageUploadProvider }),
      pluginKey: imageUploadPluginKey,
    });

  it('supports inserting an external image via command', () => {
    const { editorView } = editor(doc(p('{<>}')));

    insertExternalImage({ src: testImgSrc })(
      editorView.state,
      editorView.dispatch,
    );
    expect(editorView.state.doc).toEqualDocument(doc(testImg()));
  });

  it('permits an image to be added when an image is selected', () => {
    const { editorView, sel } = editor(doc(p('{<>}'), testImg()));
    setNodeSelection(editorView, sel + 1);

    insertExternalImage({ src: testImgSrc })(
      editorView.state,
      editorView.dispatch,
    );
    expect(editorView.state.doc).toEqualDocument(
      doc(p(), testImg(), testImg()),
    );
  });

  it('permits an image to be added when there is selected text', () => {
    const { editorView } = editor(doc(p('{<}hello{>}')));

    insertExternalImage({ src: testImgSrc })(
      editorView.state,
      editorView.dispatch,
    );
    expect(editorView.state.doc).toEqualDocument(doc(p('hello'), testImg()));
  });

  it('inserts an image after the code block if selection is inside code block', () => {
    const { editorView } = editor(doc(code_block()('{<>}')));

    insertExternalImage({ src: testImgSrc })(
      editorView.state,
      editorView.dispatch,
    );
    expect(editorView.state.doc).toEqualDocument(
      doc(code_block()(), testImg()),
    );
  });

  it('should invoke upload handler after pasting an image', async () => {
    const imageUploadHandler = jest.fn();
    const imageUploadProvider = Promise.resolve(imageUploadHandler);
    const { editorView } = editor(doc(p('{<>}')), imageUploadProvider);

    // Wait for imageUploadProvider to resolve and be ready
    await imageUploadProvider;

    dispatchPasteEvent(editorView, { types: ['Files'] });
    expect(imageUploadHandler).toHaveBeenCalledTimes(1);
    expect(imageUploadHandler.mock.calls[0][0].clipboardData.types).toContain(
      'Files',
    );
  });

  it('should invoke upload handler after dropping an image', async () => {
    const imageUploadHandler = jest.fn();
    const imageUploadProvider = Promise.resolve(imageUploadHandler);
    const { editorView } = editor(doc(p('{<>}')), imageUploadProvider);

    // Wait for imageUploadProvider to resolve and be ready
    await imageUploadProvider;

    const event = createEvent('drop');
    Object.defineProperties(event, {
      dataTransfer: {
        value: {
          getData: () => '',
          setData: () => {},
          clearData: () => {},
          types: ['Files'],
          files: [],
          items: [],
        },
      },
    });

    editorView.dom.dispatchEvent(event);
    expect(imageUploadHandler).toHaveBeenCalledTimes(1);
    expect(imageUploadHandler.mock.calls[0][0].dataTransfer.types).toContain(
      'Files',
    );
  });

  it('should call the provider correctly with startImageUpload command', async () => {
    const imageUploadHandler: ImageUploadProvider = jest.fn();
    const imageUploadProvider = Promise.resolve(imageUploadHandler);
    const { editorView } = editor(doc(p('{<>}')), imageUploadProvider);

    await imageUploadProvider;

    const event = createEvent('custom');

    const started = startImageUpload(event)(
      editorView.state,
      editorView.dispatch,
    );
    expect(started).toBeTruthy();
    expect(imageUploadHandler).toHaveBeenCalledTimes(1);
  });

  it('should insert the external image via command with provider', async () => {
    const imageUploadHandler: ImageUploadProvider = jest.fn((_e, cb) => {
      cb({
        src: testImgSrc,
      });
    });
    const imageUploadProvider = Promise.resolve(imageUploadHandler);
    const { editorView } = editor(doc(p('{<>}')), imageUploadProvider);

    await imageUploadProvider;

    startImageUpload()(editorView.state, editorView.dispatch);
    expect(editorView.state.doc).toEqualDocument(doc(testImg()));
  });
});
