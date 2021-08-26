jest.mock('prosemirror-utils', () => ({
  ...jest.requireActual<any>('prosemirror-utils'),
  findDomRefAtPos: jest.fn().mockReturnValue({ childNodes: [] }),
}));
import { findDomRefAtPos } from 'prosemirror-utils';
import {
  media,
  mediaGroup,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { MediaAttributes } from '@atlaskit/adf-schema';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { ProviderFactory } from '@atlaskit/editor-common';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { MediaPluginStateImplementation, stateKey } from '../../main';
import { MediaPluginState } from '../../types';
import { MediaPluginOptions } from '../../../media-plugin-options';
import {
  getFreshMediaProvider,
  temporaryFileId,
  testCollectionName,
} from '../../../../../__tests__/unit/plugins/media/_utils';

describe('MediaPluginState', () => {
  const setup = (allowMediaInline = true) => {
    const createEditor = createEditorFactory<MediaPluginState>();
    const contextIdentifierProvider = storyContextIdentifierProviderFactory();
    const mediaProvider = getFreshMediaProvider();
    const providerFactory = ProviderFactory.create({
      contextIdentifierProvider,
      mediaProvider,
    });
    const editor = (doc: DocBuilder) => {
      const wrapper = createEditor({
        doc,
        editorProps: {
          media: {
            provider: mediaProvider,
            allowMediaSingle: true,
            allowMediaInline: true,
            allowLinking: true,
          },
        },
        providerFactory,
        pluginKey: stateKey,
      });
      return wrapper;
    };
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
    const { editorView } = editor(doc);
    const { state } = editorView;
    const options: MediaPluginOptions = {
      allowResizing: true,
      providerFactory,
      nodeViews: {},
    };
    const reactContext: any = () => {};
    const mediaPlugin = new MediaPluginStateImplementation(
      state,
      options,
      reactContext,
      { allowMediaInline },
    );

    return {
      mediaPlugin,
      editorView,
    };
  };

  it('should use a different position when allowMediaInline=true', () => {
    const { mediaPlugin, editorView } = setup();

    // initially the plugin calls updateElement twice; on init and another from the update method
    expect(findDomRefAtPos).toBeCalledTimes(2);
    mediaPlugin.setView(editorView);
    mediaPlugin.updateElement();

    expect(findDomRefAtPos).toBeCalledTimes(3);
    expect(findDomRefAtPos).lastCalledWith(1, expect.anything());
  });

  it('should use initial position when allowMediaInline=false', () => {
    const { mediaPlugin, editorView } = setup(false);

    mediaPlugin.setView(editorView);
    mediaPlugin.updateElement();

    expect(findDomRefAtPos).lastCalledWith(0, expect.anything());
  });
});
