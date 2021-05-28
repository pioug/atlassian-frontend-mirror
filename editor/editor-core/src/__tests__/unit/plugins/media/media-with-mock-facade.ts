import { ProviderFactory } from '@atlaskit/editor-common';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import randomId from '@atlaskit/editor-test-helpers/random-id';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';

import { stateKey as mediaPluginKey } from '../../../../plugins/media/pm-plugins/main';
import { MediaPluginState } from '../../../../plugins/media/pm-plugins/types';

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

const getFreshMediaProvider = () =>
  storyMediaProviderFactory({
    collectionName: testCollectionName,
    includeUserAuthProvider: false,
  });

describe('Media with mock facade', () => {
  const createEditor = createEditorFactory<MediaPluginState>();
  const mediaProvider = getFreshMediaProvider();
  const providerFactory = ProviderFactory.create({ mediaProvider });

  const editor = (
    doc: DocBuilder,
    editorProps = {},
    dropzoneContainer: HTMLElement = document.body,
  ) =>
    createEditor({
      doc,
      editorProps: {
        ...editorProps,
        media: {
          provider: mediaProvider,
          allowMediaSingle: true,
          customDropzoneContainer: dropzoneContainer,
        },
      },
      providerFactory,
      pluginKey: mediaPluginKey,
    });

  it('should call onPopupPickerOpen(false) callback when onPopupPickerClose is called', async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    const onPopupPickerOpenMock = jest.fn();

    await mediaProvider;

    pluginState.onPopupToggle(onPopupPickerOpenMock);
    pluginState.onPopupPickerClose();
    expect(onPopupPickerOpenMock).toHaveBeenCalledTimes(1);
    expect(onPopupPickerOpenMock).toHaveBeenCalledWith(false);
  });
});
