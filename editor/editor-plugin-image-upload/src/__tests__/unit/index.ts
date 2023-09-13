import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { setNodeSelection } from '@atlaskit/editor-common/utils';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import createEvent from '@atlaskit/editor-test-helpers/create-event';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  code_block,
  doc,
  media,
  mediaSingle,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { insertExternalImage } from '../../pm-plugins/commands';
import { stateKey as imageUploadPluginKey } from '../../pm-plugins/plugin-key';

const createMockDataTransferObjectOffEvent = (overrides: any = {}) => {
  return {
    getData: () => '',
    setData: () => {},
    clearData: () => {},
    types: ['Files'],
    files: [],
    items: {
      add: jest.fn(),
      remove: jest.fn,
      clear: jest.fn(),
    },
    ...overrides,
  };
};

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
    global.DataTransfer = jest.fn().mockImplementation(() =>
      createMockDataTransferObjectOffEvent({
        types: ['Files', 'text/plain', 'text/html', 'image/png'],
        files: [new File([], 'image.png', { type: 'image/png' })],
      }),
    );
    const imageUploadHandler = jest.fn();
    const imageUploadProvider = Promise.resolve(imageUploadHandler);
    const { editorView } = editor(doc(p('{<>}')), imageUploadProvider);

    // Wait for imageUploadProvider to resolve and be ready
    await imageUploadProvider;

    const html = `<html>
      <head></head>
      <body>Rich <strong>formatted</strong> content</body>
    </html>`;

    dispatchPasteEvent(editorView, {
      html,
      plain: 'Plain text content',
      types: ['Files', 'text/plain', 'text/html', 'image/png'],
      files: [new File([], 'image.png', { type: 'image/png' })],
    });
    expect(imageUploadHandler).toHaveBeenCalledTimes(1);
    expect(imageUploadHandler.mock.calls[0][0].clipboardData.types).toContain(
      'Files',
    );
  });

  it('should ignore screenshot file when pasting text from Microsoft Office', async () => {
    const imageUploadHandler = jest.fn();
    const imageUploadProvider = Promise.resolve(imageUploadHandler);
    const { editorView } = editor(doc(p('{<>}')), imageUploadProvider);

    // Wait for imageUploadProvider to resolve and be ready
    await imageUploadProvider;

    const html = `<html
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
      xmlns="http://www.w3.org/TR/REC-html40"
    >
      <head></head>
      <body>Rich <strong>formatted</strong> content</body>
    </html>`;

    dispatchPasteEvent(editorView, {
      types: ['Files', 'text/plain', 'text/html', 'image/png'],
      html,
      plain: 'Plain text content',
      files: [new File([], 'image.png', { type: 'image/png' })],
    });

    expect(imageUploadHandler).not.toBeCalled();
  });

  it('should invoke upload handler after dropping an image', async () => {
    global.DataTransfer = jest
      .fn()
      .mockImplementation(() => createMockDataTransferObjectOffEvent());

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
});
