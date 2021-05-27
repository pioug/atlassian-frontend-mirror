import { getPluginState, inlineCommentPluginKey } from './../../utils';
import { IntlProvider } from 'react-intl';
import {
  doc,
  emoji,
  h1,
  p,
  taskItem,
  taskList,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import annotationPlugin from '../..';
import emojiPlugin from '../../../emoji';
import blockTypePlugin from '../../../block-type';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';
import { buildToolbar } from '../../toolbar';
import { inlineCommentProvider } from '../_utils';
import {
  FloatingToolbarConfig,
  FloatingToolbarButton,
} from '../../../floating-toolbar/types';
import { Command } from '../../../../types';
import { SelectionBookmark, AllSelection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { AnnotationSharedClassNames } from '@atlaskit/editor-common';

const annotationPreset = new Preset<LightEditorPlugin>()
  .add([annotationPlugin, { inlineComment: inlineCommentProvider }])
  .add(emojiPlugin)
  .add(blockTypePlugin)
  .add(tasksAndDecisionsPlugin);

const emojiProvider = getTestEmojiResource();
const providerFactory = ProviderFactory.create({ emojiProvider });

describe('annotation', () => {
  const createEditor = createProsemirrorEditorFactory();
  const intlProvider = new IntlProvider({ locale: 'en' });
  const { intl } = intlProvider.getChildContext();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      providerFactory,
      pluginKey: inlineCommentPluginKey,
      preset: annotationPreset,
    });

  describe('floating toolbar', () => {
    it('shows when ranged selection', async () => {
      const { editorView } = editor(
        doc(p('Trysail Sail ho {<}Corsair smartly{>} boom gangway.')),
      );

      const toolbar = buildToolbar(editorView.state, intl);
      expect(toolbar).toBeDefined();

      expect((toolbar as FloatingToolbarConfig).items.length).toBe(1);
    });

    it('shows on headings', () => {
      const { editorView } = editor(
        doc(h1('Trysail Sail ho {<}Corsair smartly{>} boom gangway.')),
      );

      const toolbar = buildToolbar(editorView.state, intl);
      expect(toolbar).toBeDefined();
    });

    it('shows on all selection', () => {
      const { editorView } = editor(
        doc(p('Trysail Sail ho Corsair smartly boom gangway.')),
      );

      editorView.dispatch(
        editorView.state.tr.setSelection(
          new AllSelection(editorView.state.doc),
        ),
      );

      const toolbar = buildToolbar(editorView.state, intl);
      expect(toolbar).toBeDefined();
    });

    it('shows on tasks', () => {
      const { editorView } = editor(
        doc(
          taskList({ localId: 'local-task' })(
            taskItem({ localId: 'local-task', state: 'DONE' })(
              'Trysail Sail ho {<}Corsair smartly{>} boom gangway.',
            ),
          ),
        ),
      );

      const toolbar = buildToolbar(editorView.state, intl);
      expect(toolbar).toBeDefined();
    });

    it('hides when caret selection', () => {
      const { editorView } = editor(
        doc(p('Trysail Sail ho {<>}Corsair smartly boom gangway.')),
      );

      const toolbar = buildToolbar(editorView.state, intl);
      expect(toolbar).toBeUndefined();
    });

    it('hides on node selection', () => {
      const { editorView } = editor(
        doc(p('Corsair', '{<node>}', emoji({ shortName: ':smiley:' })())),
      );

      const toolbar = buildToolbar(editorView.state, intl);
      expect(toolbar).toBeUndefined();
    });
  });

  it('on click create button enters drafting mode', () => {
    const { editorView } = editor(
      doc(p('Trysail Sail ho {<}Corsair smartly{>} boom gangway.')),
    );

    const toolbar = buildToolbar(editorView.state, intl);
    expect(toolbar).toBeDefined();

    expect((<FloatingToolbarConfig>toolbar).items.length).toBe(1);
    const createButton = (<Array<any>>(
      (<FloatingToolbarConfig>toolbar).items
    ))[0] as FloatingToolbarButton<Command>;
    createButton.onClick(editorView.state, editorView.dispatch);

    const pluginState = getPluginState(editorView.state);

    expect(pluginState.bookmark).toBeTruthy();
    const resolvedBookmark = (<SelectionBookmark>pluginState.bookmark).resolve(
      editorView.state.doc,
    );
    expect(resolvedBookmark.from).toBe(17);
    expect(resolvedBookmark.to).toBe(32);
    expect(pluginState.bookmark).toBeTruthy();
    expect(pluginState.draftDecorationSet).toBeTruthy();
    const decorations = (<DecorationSet>pluginState.draftDecorationSet).find(
      0,
      editorView.state.doc.content.size,
    );
    expect(decorations.length).toBe(1);
    expect((decorations[0] as any).type.attrs.class).toEqual(
      AnnotationSharedClassNames.draft,
    );
  });
});
