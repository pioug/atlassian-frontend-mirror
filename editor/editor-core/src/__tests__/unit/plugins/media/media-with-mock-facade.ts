import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import randomId from '@atlaskit/editor-test-helpers/random-id';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';

import { stateKey as mediaPluginKey } from '../../../../plugins/media/pm-plugins/main';
import type { MediaPluginState } from '../../../../plugins/media/pm-plugins/types';

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

const getFreshMediaProvider = () =>
  storyMediaProviderFactory({
    collectionName: testCollectionName,
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
