// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  media,
  mediaSingle,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import type { MediaAttributes } from '@atlaskit/adf-schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import type { EditorSelectionAPI } from '@atlaskit/editor-common/selection';
import { createEditorSelectionAPI } from '@atlaskit/editor-core/src/selection-api/api';

import { getFreshMediaProvider } from '../../../../../__tests__/unit/plugins/media/_utils';
import { stateKey } from '../../main';
import type { MediaPluginState } from '../../types';
import { sendArrowLeftKey, sendArrowRightKey } from './_utils';

const createEditor = createEditorFactory<MediaPluginState>();
const contextIdentifierProvider = storyContextIdentifierProviderFactory();
const editorSelectionAPI: EditorSelectionAPI = createEditorSelectionAPI();
const mediaProvider = getFreshMediaProvider();
const providerFactory = ProviderFactory.create({
  contextIdentifierProvider,
  mediaProvider,
});

const editor = (doc: DocBuilder) =>
  createEditor({
    doc,
    editorProps: {
      media: {
        provider: mediaProvider,
        allowMediaSingle: true,
        allowCaptions: true,
        allowLinking: true,
        editorSelectionAPI,
      },
    },
    providerFactory,
    pluginKey: stateKey,
  });

const attrs: MediaAttributes = {
  id: 'a559980d-cd47-43e2-8377-27359fcb905f',
  type: 'file',
  collection: 'MediaServicesSample',
  __contextId: 'DUMMY-OBJECT-ID',
  __fileMimeType: 'image/jpeg',
  __fileName: 'tall_image.jpeg',
  __fileSize: 58705,
  alt: 'test',
  width: 500,
  height: 374,
};

describe('media keymap', () => {
  describe('arrowRightFromMediaSingle', () => {
    it('arrow right selection continues past media node', () => {
      const { editorView } = editor(
        doc(p('START{<>}'), mediaSingle()(media(attrs)()), p('END')),
      );

      // First: goes before media node as a gap cursor
      // Second: goes as node selection at the media node
      // Third: should go as gap cursor after the media node
      sendArrowRightKey(editorView, { numTimes: 3 });

      expect(editorView.state).toEqualDocumentAndSelection(
        doc(p('START'), mediaSingle()(media(attrs)()), '{<|gap>}', p('END')),
      );
    });
  });

  describe('arrowLeftFromMediaSingle', () => {
    it('left right selection continues past media node', () => {
      const { editorView } = editor(
        doc(p('START'), mediaSingle()(media(attrs)()), p('{<>}END')),
      );

      // First: goes after media node as a gap cursor
      // Second: goes as node selection at the media node
      // Third: should go as gap cursor before the media node
      sendArrowLeftKey(editorView, { numTimes: 3 });

      expect(editorView.state).toEqualDocumentAndSelection(
        doc(p('START'), '{<gap|>}', mediaSingle()(media(attrs)()), p('END')),
      );
    });
  });
});
