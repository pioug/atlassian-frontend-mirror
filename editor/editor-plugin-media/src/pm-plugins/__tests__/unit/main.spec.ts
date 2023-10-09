jest.mock('@atlaskit/editor-prosemirror/utils', () => ({
  ...jest.requireActual<any>('@atlaskit/editor-prosemirror/utils'),
  findDomRefAtPos: jest.fn().mockReturnValue({ childNodes: [] }),
}));
import type { MediaAttributes } from '@atlaskit/adf-schema';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { media, mediaGroup } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  getFreshMediaProvider,
  temporaryFileId,
  testCollectionName,
} from '@atlaskit/editor-test-helpers/media-provider';

import type { MediaPluginOptions } from '../../../media-plugin-options';
import { MediaPluginStateImplementation, stateKey } from '../../main';
import type { MediaPluginState } from '../../types';

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
            allowLinking: true,
            featureFlags: {
              mediaInline: true,
            },
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
    const mediaPlugin = new MediaPluginStateImplementation(
      state,
      options,
      {
        featureFlags: {
          mediaInline: allowMediaInline,
        },
      },
      undefined,
      undefined,
      undefined,
    );

    return {
      mediaPlugin,
      editorView,
    };
  };

  it('should still use initial position when allowMediaInline=true', () => {
    const { mediaPlugin, editorView } = setup();

    // initially the plugin calls updateElement 2 times; on init, another from the update method
    expect(findDomRefAtPos).toBeCalledTimes(2);
    mediaPlugin.setView(editorView);
    mediaPlugin.updateElement();

    expect(findDomRefAtPos).toBeCalledTimes(3);
    expect(findDomRefAtPos).lastCalledWith(0, expect.anything());
  });

  it('should use initial position when allowMediaInline=false', () => {
    const { mediaPlugin, editorView } = setup(false);

    mediaPlugin.setView(editorView);
    mediaPlugin.updateElement();

    expect(findDomRefAtPos).lastCalledWith(0, expect.anything());
  });
});
