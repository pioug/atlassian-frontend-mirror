import type {
  ImageUploadProvider,
  InsertedImageProperties,
} from '@atlaskit/editor-common/provider-factory';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { stateKey as imageUploadPluginKey } from '../../../../plugins/image-upload/pm-plugins/plugin-key';

import * as commands from '../../../../plugins/image-upload/pm-plugins/commands';

const mockInsertExternalImageSpy = jest.fn(
  (options: InsertedImageProperties) => {
    return () => true;
  },
);

jest
  .spyOn(commands, 'insertExternalImage')
  .mockImplementation(mockInsertExternalImageSpy);

import { insertActionForToolbar } from '../../../../plugins/image-upload/pm-plugins/commands-toolbar';

describe('image-upload', () => {
  const createEditor = createEditorFactory();
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

  it('should call the provider correctly when toolbar button clicked', async () => {
    const commandNull = insertActionForToolbar({
      current: null,
    });
    const callbackPrevent: ImageUploadProvider = jest.fn(() => {
      // Do nothing
    });
    const commandPrevent = insertActionForToolbar({
      current: callbackPrevent,
    });
    const callback: ImageUploadProvider = jest.fn((e, insertImageFn) => {
      // Call provided insert function
      insertImageFn({ src: 'test' });
    });
    const commandAllow = insertActionForToolbar({
      current: jest.fn(callback),
    });

    const { editorView } = editor(doc(p('{<>}')));
    const { state, dispatch } = editorView;

    expect(commandNull(state, dispatch)).toBe(false);

    expect(commandPrevent(state, dispatch)).toBe(true);
    expect(callbackPrevent).toBeCalledTimes(1);
    expect(mockInsertExternalImageSpy).toBeCalledTimes(0);

    expect(commandAllow(state, dispatch)).toBe(true);
    expect(callback).toBeCalledTimes(1);
    expect(mockInsertExternalImageSpy).toBeCalledTimes(1);
  });
});
