jest.mock('prosemirror-utils', () => ({
  ...jest.requireActual<any>('prosemirror-utils'),
  findParentNodeOfType: jest
    .fn()
    .mockReturnValue(() => ({ node: { type: 'mediaGroup' } })),
}));
jest.mock('@atlaskit/media-client', () => ({
  ...jest.requireActual<any>('@atlaskit/media-client'),
  getMediaClient: jest.fn().mockReturnValue({
    file: {
      getCurrentState: jest
        .fn()
        .mockReturnValue({ status: 'processed', name: 'some-file-name' }),
      downloadBinary: jest.fn(),
    },
  }),
}));
import { getMediaClient } from '@atlaskit/media-client';
import { ProviderFactory } from '@atlaskit/editor-common';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  media,
  mediaGroup,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { MediaAttributes } from '@atlaskit/adf-schema';
import { IntlProvider } from 'react-intl';
import { MediaOptions } from '../../../../../plugins/media/types';
import { stateKey } from '../../../../../plugins/media/pm-plugins/main';
import { floatingToolbar } from '../../index';
import {
  getFreshMediaProvider,
  temporaryFileId,
  testCollectionName,
} from '../../../../../__tests__/unit/plugins/media/_utils';
import {
  getToolbarItems,
  findToolbarBtn,
} from '../../../../../plugins/floating-toolbar/__tests__/_helpers';
import { MediaPluginState } from '../../../../../plugins/media/pm-plugins/types';

describe('floatingToolbar()', () => {
  const intlProvider = new IntlProvider({ locale: 'en' });
  const { intl } = intlProvider.getChildContext();
  const createEditor = createEditorFactory<MediaPluginState>();

  const editor = (doc: DocBuilder, mediaPropsOverride: MediaOptions = {}) => {
    const contextIdentifierProvider = storyContextIdentifierProviderFactory();
    const mediaProvider = getFreshMediaProvider();
    const providerFactory = ProviderFactory.create({
      contextIdentifierProvider,
      mediaProvider,
    });
    const wrapper = createEditor({
      doc,
      editorProps: {
        media: {
          provider: mediaProvider,
          allowMediaSingle: true,
          ...mediaPropsOverride,
        },
      },
      providerFactory,
      pluginKey: stateKey,
    });
    return wrapper;
  };
  const setup = async (allowMediaInline: boolean) => {
    const attrs: MediaAttributes = {
      id: temporaryFileId,
      type: 'file',
      collection: testCollectionName,
      __fileMimeType: 'image/png',
      __contextId: 'DUMMY-OBJECT-ID',
      width: 100,
      height: 100,
    };

    const doc = mediaGroup(media(attrs)());
    const { editorView, pluginState } = editor(doc, {
      allowMediaInline,
      allowLinking: true,
    });
    await pluginState.setMediaProvider(getFreshMediaProvider());

    // manually override type to pass mediaGroup node checking
    editorView.state.schema.nodes.mediaGroup = 'mediaGroup';
    const toolbar = floatingToolbar(editorView.state, intl, {
      allowMediaInline,
    });
    const items = getToolbarItems(toolbar!, editorView);
    const mediaPluginState: MediaPluginState | undefined = stateKey.getState(
      editorView.state,
    );

    return {
      editorView,
      items,
      mediaPluginState,
    };
  };

  it('should return media group items', async () => {
    const { items } = await setup(true);

    expect(items).toMatchSnapshot();
  });

  it('should not return media group items if allowMediaInline is false', async () => {
    const { items } = await setup(false);

    expect(items).toMatchSnapshot();
  });

  it('should download file when clicking on the download button', async () => {
    const { items, editorView } = await setup(true);
    const downloadButton = findToolbarBtn(items, 'Download');
    const mediaClient = getMediaClient({} as any);

    expect(mediaClient.file.downloadBinary).toHaveBeenCalledTimes(0);
    downloadButton.onClick(editorView.state);
    await mediaClient.file.downloadBinary;
    expect(mediaClient.file.downloadBinary).toHaveBeenCalledTimes(1);
    expect(mediaClient.file.downloadBinary).toBeCalledWith(
      undefined,
      'some-file-name',
      '',
    );
  });

  it('should remove card when clicking on the delete button', async () => {
    const { items, editorView, mediaPluginState } = await setup(true);
    const removeButton = findToolbarBtn(items, 'Remove');
    const spy = jest.spyOn(mediaPluginState!, 'handleMediaNodeRemoval');

    expect(spy).toBeCalledTimes(0);
    removeButton.onClick(editorView.state);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(spy).toBeCalledTimes(1);
  });
});
