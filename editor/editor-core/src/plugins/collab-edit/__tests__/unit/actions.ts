import { EditorView } from 'prosemirror-view';
import {
  doc,
  p,
  mention,
  unsupportedInline,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { mention as mentionData } from '@atlaskit/util-data-test';
import { MentionProvider } from '@atlaskit/mention/resource';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import { handleInit, applyRemoteSteps } from '../../actions';
import { CollabEventInitData, PrivateCollabEditOptions } from '../../types';
import collabEditPlugin from '../../index';
import mentionsPlugin from '../../../mentions';
import unsupportedContentPlugin from '../../../unsupported-content';

const unknownNodesDoc = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          text: 'Valid! ',
          type: 'text',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'invalidNode',
          attrs: {
            url: 'https://atlassian.net',
          },
        },
        {
          text: ' ',
          type: 'text',
        },
      ],
    },
  ],
  version: 1,
};

const privateContentNodesDoc = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          text: 'Bacon ',
          type: 'text',
        },
        {
          attrs: {
            id: '123',
            text: '@cheese',
          },
          type: 'mention',
        },
        {
          text: ' ham',
          type: 'text',
        },
      ],
    },
  ],
  version: 1,
};

const initializeCollab = (view: EditorView) =>
  view.dispatch(view.state.tr.setMeta('collabInitialised', true));

describe('collab-edit: actions', () => {
  const createEditor = createProsemirrorEditorFactory();
  const mentionProvider: Promise<MentionProvider> = Promise.resolve(
    mentionData.storyData.resourceProvider,
  );
  const providerFactory = ProviderFactory.create({ mentionProvider });

  const editor = (
    doc: any,
    collabEditOptions: PrivateCollabEditOptions = {},
  ) => {
    return createEditor({
      doc,
      // Preset doesnt support two arguments, we need to use old plugins configuration
      preset: new Preset<LightEditorPlugin>()
        .add([collabEditPlugin, collabEditOptions as PrivateCollabEditOptions])
        .add(unsupportedContentPlugin)
        .add(mentionsPlugin),
      providerFactory,
    });
  };

  describe('handleInit', () => {
    it('should wrap invalid nodes in unsupported when the allowUnsupportedContent option is enabled.', () => {
      const { editorView } = editor(doc(p('')));

      const initData: CollabEventInitData = {
        doc: unknownNodesDoc,
      };

      initializeCollab(editorView);
      handleInit(initData, editorView, { allowUnsupportedContent: true });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('Valid! '),
          p(
            unsupportedInline({
              originalValue: {
                attrs: { url: 'https://atlassian.net' },
                type: 'invalidNode',
              },
            })(),
            ' ',
          ),
        ),
      );
    });

    it('should sanitize private content when the sanitizePrivateContent option is enabled.', () => {
      const collabEditOptions: PrivateCollabEditOptions = {
        allowUnsupportedContent: true,
        sanitizePrivateContent: true,
      };
      const { editorView } = editor(doc(p('')), collabEditOptions);

      const initData: CollabEventInitData = {
        doc: privateContentNodesDoc,
      };

      initializeCollab(editorView);
      handleInit(initData, editorView, collabEditOptions, providerFactory);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('Bacon ', mention({ id: '123', text: '' })(), ' ham')),
      );
    });

    it('should not sanitize private content when the sanitizePrivateContent option is disabled.', () => {
      const collabEditOptions: PrivateCollabEditOptions = {
        allowUnsupportedContent: true,
        sanitizePrivateContent: false,
      };
      const { editorView } = editor(doc(p('')), collabEditOptions);

      const initData: CollabEventInitData = {
        doc: privateContentNodesDoc,
      };

      initializeCollab(editorView);
      handleInit(initData, editorView, collabEditOptions, providerFactory);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('Bacon ', mention({ id: '123', text: '@cheese' })(), ' ham')),
      );
    });
  });

  describe('applyRemoteSteps', () => {
    describe("when selection is same as the firstStep's", () => {
      it('should set selection, mapping to the new document', () => {
        const { editorView } = editor(doc(p('{<}This is all my text{>}')));
        const replaceWithAStep = [
          {
            stepType: 'replace',
            from: 1,
            to: 20,
            slice: {
              content: [{ type: 'text', text: 'a' }],
            },
          },
        ];

        initializeCollab(editorView);
        applyRemoteSteps(replaceWithAStep, [], editorView);

        const { from, to } = editorView.state.selection;
        expect({ from, to }).toEqual({
          from: 1,
          to: 2,
        });
      });
    });
  });
});
