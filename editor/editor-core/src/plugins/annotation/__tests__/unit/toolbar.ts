import { getPluginState } from './../../pm-plugins/inline-comment';
import { IntlProvider } from 'react-intl';
import {
  doc,
  emoji,
  h1,
  p,
  taskItem,
  taskList,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { emoji as emojiData } from '@atlaskit/util-data-test';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { inlineCommentPluginKey } from '../../pm-plugins/plugin-factory';
import annotationPlugin from '../..';
import emojiPlugin from '../../../emoji';
import blockTypePlugin from '../../../block-type';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';
import { buildToolbar } from '../../toolbar';
import { hasInlineNodes } from '../../utils';
import { inlineCommentProvider, nullComponent } from '../_utils';
import {
  FloatingToolbarConfig,
  FloatingToolbarButton,
} from '../../../floating-toolbar/types';
import { Command } from '../../../../types';
import { SelectionBookmark } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { DraftDecorationClassName } from '../../types';

jest.useFakeTimers();

const annotationPreset = new Preset<LightEditorPlugin>()
  .add([
    annotationPlugin,
    {
      createComponent: nullComponent,
      viewComponent: nullComponent,
      providers: { inlineComment: inlineCommentProvider },
    },
  ])
  .add(emojiPlugin)
  .add(blockTypePlugin)
  .add(tasksAndDecisionsPlugin);

const emojiProvider = emojiData.testData.getEmojiResourcePromise();
const providerFactory = ProviderFactory.create({ emojiProvider });

describe('annotation', () => {
  const createEditor = createProsemirrorEditorFactory();
  const intlProvider = new IntlProvider({ locale: 'en' });
  const { intl } = intlProvider.getChildContext();

  const editor = (doc: any) =>
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

      // Let the getState promise resolve
      jest.runOnlyPendingTimers();
      await new Promise(resolve => {
        process.nextTick(resolve);
      });

      const toolbar = buildToolbar(editorView.state, intl);
      expect(toolbar).toBeDefined();

      expect((toolbar as FloatingToolbarConfig).items.length).toBe(1);
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
      const resolvedBookmark = (<SelectionBookmark>(
        pluginState.bookmark
      )).resolve(editorView.state.doc);
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
        DraftDecorationClassName,
      );
    });

    it('hides when caret selection', async () => {
      const { editorView } = editor(
        doc(p('Trysail Sail ho {<>}Corsair smartly boom gangway.')),
      );

      // Let the getState promise resolve
      jest.runOnlyPendingTimers();
      await new Promise(resolve => {
        process.nextTick(resolve);
      });

      const toolbar = buildToolbar(editorView.state, intl);
      expect(toolbar).toBeUndefined();
    });

    it('shows on headings', async () => {
      const { editorView } = editor(
        doc(h1('Trysail Sail ho {<}Corsair smartly{>} boom gangway.')),
      );

      // Let the getState promise resolve
      jest.runOnlyPendingTimers();
      await new Promise(resolve => {
        process.nextTick(resolve);
      });

      const toolbar = buildToolbar(editorView.state, intl);
      expect(toolbar).toBeDefined();
    });

    it('shows on tasks', async () => {
      const { editorView } = editor(
        doc(
          taskList({ localId: 'local-task' })(
            taskItem({ localId: 'local-task', state: 'DONE' })(
              'Trysail Sail ho {<}Corsair smartly{>} boom gangway.',
            ),
          ),
        ),
      );

      // Let the getState promise resolve
      jest.runOnlyPendingTimers();
      await new Promise(resolve => {
        process.nextTick(resolve);
      });

      const toolbar = buildToolbar(editorView.state, intl);
      expect(toolbar).toBeDefined();
    });
  });

  describe('hasInlineNodes', () => {
    test.each([
      [
        'text only',
        doc(p('{<}Corsair{>}', emoji({ shortName: ':smiley:' })())),
        false,
      ],
      [
        'mixed',
        doc(p('{<}Corsair', emoji({ shortName: ':smiley:' })(), '{>}')),
        true,
      ],
      [
        'inline only',
        doc(p('Corsair{<}', emoji({ shortName: ':smiley:' })(), '{>}')),
        true,
      ],
    ])('%s', async (_, inputDoc, expected) => {
      const { editorView } = editor(inputDoc);

      // Let the getState promise resolve
      jest.runOnlyPendingTimers();
      await new Promise(resolve => {
        process.nextTick(resolve);
      });

      expect(hasInlineNodes(editorView.state)).toBe(expected);
    });
  });
});