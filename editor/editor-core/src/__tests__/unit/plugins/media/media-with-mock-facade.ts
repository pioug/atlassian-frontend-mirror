import { spies, removeOnCloseListener } from './media-with-mock-facade.mock';
import { nextTick } from '@atlaskit/media-test-helpers';
import { ProviderFactory } from '@atlaskit/editor-common';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import randomId from '@atlaskit/editor-test-helpers/random-id';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';

import { stateKey as mediaPluginKey } from '../../../../plugins/media/pm-plugins/main';
import { waitForAllPickersInitialised } from './_utils';
import { MediaPluginState } from '../../../../plugins/media/pm-plugins/types';

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

const getFreshMediaProvider = () =>
  storyMediaProviderFactory({
    collectionName: testCollectionName,
    includeUserAuthProvider: true,
  });

describe('Media with mock facade', () => {
  const createEditor = createEditorFactory<MediaPluginState>();
  const mediaProvider = getFreshMediaProvider();
  const providerFactory = ProviderFactory.create({ mediaProvider });

  const editor = (
    doc: any,
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

  it('should add an onClose event listener in popupPicker', async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    await waitForAllPickersInitialised(pluginState);

    await mediaProvider;

    expect(spies.popup.onClose).toHaveBeenCalledTimes(1);
    expect(spies.popup.onClose).toHaveBeenCalledWith(
      pluginState.onPopupPickerClose,
    );
    pluginState.destroy();
  });

  it('should call popupPicker.show when showMediaPicker is called', async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    await waitForAllPickersInitialised(pluginState);

    await mediaProvider;

    pluginState.showMediaPicker();
    expect(spies.popup.show).toHaveBeenCalledTimes(1);
  });

  it('should call onPopupPickerOpen(true) callback when showMediaPicker is called', async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    const onPopupPickerOpenMock = jest.fn();
    await waitForAllPickersInitialised(pluginState);

    await mediaProvider;

    pluginState.onPopupToggle(onPopupPickerOpenMock);
    pluginState.showMediaPicker();
    expect(onPopupPickerOpenMock).toHaveBeenCalledTimes(1);
    expect(onPopupPickerOpenMock).toHaveBeenCalledWith(true);
  });

  it('should call onPopupPickerOpen(false) callback when onPopupPickerClose is called', async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    const onPopupPickerOpenMock = jest.fn();
    await waitForAllPickersInitialised(pluginState);

    await mediaProvider;

    pluginState.onPopupToggle(onPopupPickerOpenMock);
    pluginState.onPopupPickerClose();
    expect(onPopupPickerOpenMock).toHaveBeenCalledTimes(1);
    expect(onPopupPickerOpenMock).toHaveBeenCalledWith(false);
  });

  it('should cleanup properly on destroy', async () => {
    removeOnCloseListener.mockClear();
    const { pluginState } = editor(doc(p('{<>}')));
    await waitForAllPickersInitialised(pluginState);

    await mediaProvider;

    pluginState.destroy();
    expect(removeOnCloseListener).toHaveBeenCalledTimes(1);
  });

  it('should cleanup properly on destroy when pickers arent completely initialised.', async () => {
    spies.popup.destroy.mockClear();
    const { pluginState } = editor(doc(p('{<>}')));

    await mediaProvider;
    await nextTick();

    pluginState.destroy();
    await Promise.all(pluginState.pickerPromises);

    expect(spies.popup.destroy).toHaveBeenCalledTimes(1);
  });
});
