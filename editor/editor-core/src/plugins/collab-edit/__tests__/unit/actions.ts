import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import type { MentionProvider } from '@atlaskit/mention/resource';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import { applyRemoteSteps } from '../../actions';
import type { PrivateCollabEditOptions } from '../../types';
import collabEditPlugin from '../../index';
import { mentionsPlugin } from '@atlaskit/editor-plugin-mentions';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { unsupportedContentPlugin } from '@atlaskit/editor-plugin-unsupported-content';
import { textFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import { toggleMark } from '@atlaskit/editor-common/mark';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';

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
        .add([featureFlagsPlugin, {}])
        .add([collabEditPlugin, collabEditOptions as PrivateCollabEditOptions])
        .add(unsupportedContentPlugin)
        .add(typeAheadPlugin)
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
        applyRemoteSteps(replaceWithAStep, editorView, []);

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
      const { editorView, editorAPI } = editor(
        doc(p('This is all my text{<>}')),
      );
      const { state } = editorView;

      const { strong } = state.schema.marks;
      editorAPI.core?.actions?.execute(toggleMark(strong));

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
      applyRemoteSteps(replaceWithAStep, editorView, []);
      expect(editorView.state.storedMarks).toEqual([
        editorView.state.schema.marks.strong.create(),
      ]);
    });
  });
});
