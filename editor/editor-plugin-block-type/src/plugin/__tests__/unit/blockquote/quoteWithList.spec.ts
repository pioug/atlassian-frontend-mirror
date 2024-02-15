/* eslint-disable import/no-extraneous-dependencies */
import {
  codeBlock as codeBlockAdf,
  panel as panelAdf,
  table as tableAdf,
  tableCell as tableCellAdf,
  tableRow as tableRowAdf,
} from '@atlaskit/adf-schema';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
  DocBuilder,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { codeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { copyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import { focusPlugin } from '@atlaskit/editor-plugin-focus';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { layoutPlugin } from '@atlaskit/editor-plugin-layout';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { mediaPlugin } from '@atlaskit/editor-plugin-media';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies, import/order -- Removed import for fixing circular dependencies
import {
  blockquote,
  code_block,
  doc,
  li,
  media,
  mediaSingle,
  ol,
  p,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { ffTest } from '@atlassian/feature-flags-test-utils';

import type { BlockTypeState } from '../../../../index';
import { blockTypePlugin } from '../../../../index';
import { insertBlockQuoteWithAnalytics } from '../../../commands';
import { pluginKey as blockTypePluginKey } from '../../../pm-plugins/main';

const createEditor = createProsemirrorEditorFactory();
const attachAnalyticsEvent = jest.fn().mockImplementation(() => () => {});
const mockEditorAnalyticsAPI: EditorAnalyticsAPI = {
  attachAnalyticsEvent,
  fireAnalyticsEvent: jest.fn(),
};
const editor = (doc: DocBuilder) => {
  const preset = new Preset<LightEditorPlugin>()
    .add(mockNodesPlugin)
    .add([analyticsPlugin, {}])
    .add(contentInsertionPlugin)
    .add(editorDisabledPlugin)
    .add(decorationsPlugin)
    .add(listPlugin)
    .add(compositionPlugin)
    .add([codeBlockPlugin, { appearance: 'full-page' }])
    .add(layoutPlugin)
    .add(widthPlugin)
    .add(guidelinePlugin)
    .add(gridPlugin)
    .add(copyButtonPlugin)
    .add(floatingToolbarPlugin)
    .add(focusPlugin)
    .add(selectionPlugin)
    .add([mediaPlugin, { allowMediaSingle: true }])
    .add(blockTypePlugin);

  return createEditor<BlockTypeState, PluginKey, typeof preset>({
    doc,
    preset,
    pluginKey: blockTypePluginKey,
  });
};

const mockNodesPlugin: NextEditorPlugin<'nodesPlugin'> = ({}) => ({
  name: 'nodesPlugin',
  nodes() {
    return [
      { name: 'panel', node: panelAdf(true) },
      { name: 'codeBlock', node: codeBlockAdf },
      { name: 'table', node: tableAdf },
      { name: 'tableRow', node: tableRowAdf },
      { name: 'tableCell', node: tableCellAdf },
    ];
  },
});

describe('insertions of blockquote', () => {
  const docWithOrderedList = ol()(li(p('foo')), li(p('bar')), li(p('baz')));
  const docWithUnorderedList = ol()(li(p('foo')), li(p('bar')), li(p('baz')));

  const mediaNode = (url: string = 'image.jpg') =>
    mediaSingle()(media({ url, type: 'external', __external: true })());

  const docWithMediaInsideList = ul(li(p('foo')), li(mediaNode()));
  const docWithCodeBlockInsideList = ul(
    li(p('foo')),
    li(code_block({})('some code')),
  );

  const tests = [
    {
      input: doc(p('{<}'), docWithOrderedList, p('{>}')),
      outputWithFF: doc(blockquote(p(), docWithOrderedList, p())),
      outputWithoutFF: doc(blockquote(p()), docWithOrderedList, p()),
    },
    {
      input: doc(p('{<}'), docWithUnorderedList, p('{>}')),
      outputWithFF: doc(blockquote(p(), docWithUnorderedList, p())),
      outputWithoutFF: doc(blockquote(p()), docWithUnorderedList, p()),
    },
    {
      input: doc(p('{<}'), docWithMediaInsideList, p('{>}')),
      outputWithFF: doc(blockquote(p(), docWithMediaInsideList, p())),
      outputWithoutFF: doc(blockquote(p()), docWithMediaInsideList, p()),
    },
    {
      input: doc(p('{<}'), docWithCodeBlockInsideList, p('{>}')),
      outputWithFF: doc(blockquote(p(), docWithCodeBlockInsideList, p())),
      outputWithoutFF: doc(blockquote(p()), docWithCodeBlockInsideList, p()),
    },
  ];

  ffTest(
    'platform.editor.allow-list-in-blockquote',
    () => {
      // When FF is true
      for (const test of tests) {
        const { editorView } = editor(test.input ?? doc());
        const { state, dispatch } = editorView;
        insertBlockQuoteWithAnalytics(
          INPUT_METHOD.TOOLBAR,
          mockEditorAnalyticsAPI,
        )(state, dispatch);
        expect(editorView.state.doc).toEqualDocument(test.outputWithFF);
      }
    },
    () => {
      // When FF is false
      for (const test of tests) {
        const { editorView } = editor(test.input ?? doc());
        const { state, dispatch } = editorView;
        insertBlockQuoteWithAnalytics(
          INPUT_METHOD.TOOLBAR,
          mockEditorAnalyticsAPI,
        )(state, dispatch);
        expect(editorView.state.doc).toEqualDocument(test.outputWithoutFF);
      }
    },
  );
});
