import { EditorView } from 'prosemirror-view';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { MentionProvider } from '@atlaskit/mention/resource';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import { applyRemoteSteps } from '../../actions';
import { PrivateCollabEditOptions } from '../../types';
import collabEditPlugin from '../../index';
import mentionsPlugin from '../../../mentions';
import unsupportedContentPlugin from '../../../unsupported-content';
import textFormattingPlugin from '../../../text-formatting';
import { toggleStrong } from '../../../text-formatting/commands/text-formatting';

const initializeCollab = (view: EditorView) =>
  view.dispatch(view.state.tr.setMeta('collabInitialised', true));

describe('collab-edit: actions', () => {
  const createEditor = createProsemirrorEditorFactory();
  const mentionProvider: Promise<MentionProvider> = Promise.resolve(
    mentionResourceProvider,
  );
  const providerFactory = ProviderFactory.create({ mentionProvider });

  const editor = (
    doc: DocBuilder,
    collabEditOptions: PrivateCollabEditOptions = {},
  ) => {
    return createEditor({
      doc,
      // Preset doesnt support two arguments, we need to use old plugins configuration
      preset: new Preset<LightEditorPlugin>()
        .add([collabEditPlugin, collabEditOptions as PrivateCollabEditOptions])
        .add(unsupportedContentPlugin)
        .add(mentionsPlugin)
        .add(textFormattingPlugin),
      providerFactory,
    });
  };

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
  describe('when there are storedMarks in prosemirror state', () => {
    it('should set marks in the new transaction', () => {
      const { editorView } = editor(doc(p('This is all my text{<>}')));
      const { state, dispatch } = editorView;

      toggleStrong()(state, dispatch);
      expect(editorView.state.storedMarks).toEqual([
        editorView.state.schema.marks.strong.create(),
      ]);

      const replaceWithAStep = [
        {
          stepType: 'replace',
          from: 1,
          to: 1,
          slice: {
            content: [{ type: 'text', text: 'a' }],
          },
        },
      ];

      initializeCollab(editorView);
      applyRemoteSteps(replaceWithAStep, [], editorView);
      expect(editorView.state.storedMarks).toEqual([
        editorView.state.schema.marks.strong.create(),
      ]);
    });
  });
});
