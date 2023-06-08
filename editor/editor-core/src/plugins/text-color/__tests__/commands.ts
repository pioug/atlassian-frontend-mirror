import { PluginKey } from 'prosemirror-state';

import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  hardBreak,
  p,
  table,
  td,
  textColor,
  tr,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import blockTypePlugin from '../../block-type';
import panelPlugin from '../../panel';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { changeColor } from '../commands/change-color';
import { toggleColor } from '../commands/toggle-color';
import textColorPlugin from '../index';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import {
  pluginKey as textColorPluginKey,
  TextColorPluginState,
} from '../pm-plugins/main';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { widthPlugin } from '@atlaskit/editor-plugin-width';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('text color commands', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor<TextColorPluginState, PluginKey>({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(decorationsPlugin)
        .add(textColorPlugin)
        .add(widthPlugin)
        .add(tablesPlugin)
        .add(blockTypePlugin)
        .add(panelPlugin),
      pluginKey: textColorPluginKey,
    });

  const testColor1 = '#97a0af';
  const testColor2 = '#0747a6';
  const createTextColor = (color: string) => textColor({ color });

  describe('change color', () => {
    it('should be able to replace textColor on a character', () => {
      const { editorView } = editor(
        doc(p(createTextColor(testColor1)('{<}t{>}'), 'ext')),
      );
      const { dispatch, state } = editorView;

      expect(changeColor(testColor2)(state, dispatch));
      expect(editorView.state.doc).toEqualDocument(
        doc(p(createTextColor(testColor2)('t'), 'ext')),
      );
    });

    it('should expose whether textColor has any color on an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));
      const { dispatch, state } = editorView;

      expect(pluginState.color).toBe(pluginState.defaultColor);
      expect(changeColor(testColor2)(state, dispatch));

      const updatedPluginState = textColorPluginKey.getState(editorView.state);
      expect(updatedPluginState.color).toBe(testColor2);
    });

    it('should expose whether textColor has any color on a range selection', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));
      const { dispatch, state } = editorView;

      expect(pluginState.color).toBe(pluginState.defaultColor);
      expect(changeColor(testColor1)(state, dispatch));

      const updatedPluginState = textColorPluginKey.getState(editorView.state);
      expect(updatedPluginState.color).toBe(testColor1);
    });

    it(`shouldn't apply color to a non text node`, () => {
      const { editorView } = editor(doc(p('t{<}ext', hardBreak(), 'text{>}')));
      const { dispatch, state } = editorView;

      changeColor(testColor1)(state, dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            't',
            textColor({ color: testColor1 })('ext'),
            hardBreak(),
            textColor({ color: testColor1 })('text'),
          ),
        ),
      );
    });

    it('changeColor should remove the text colour in a cell selection', () => {
      const { editorView, pluginState } = editor(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(
              td()(p(textColor({ color: testColor1 })('{<cell}One'))),
              td()(p(textColor({ color: testColor1 })('two{cell>}'))),
            ),
          ),
        ),
      );

      const { state, dispatch } = editorView;

      changeColor(pluginState.defaultColor)(state, dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(td()(p('{<cell}One')), td()(p('two{cell>}'))),
          ),
        ),
      );
    });

    it('changeColor should remove all text colours in a cell selection', () => {
      const { editorView, pluginState } = editor(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(
              td()(p(textColor({ color: testColor1 })('{<cell}One'))),
              td()(p(textColor({ color: testColor2 })('two{cell>}'))),
            ),
          ),
        ),
      );

      const { state, dispatch } = editorView;

      changeColor(pluginState.defaultColor)(state, dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(td()(p('{<cell}One')), td()(p('two{cell>}'))),
          ),
        ),
      );
    });
  });

  describe('toggle color', () => {
    it('sets the text colour to red when only part of the selections text colour is red', () => {
      const { editorView } = editor(
        doc(
          p(
            textColor({ color: 'blue' })('{<}text'),
            hardBreak(),
            textColor({ color: 'red' })('here{>}'),
          ),
        ),
      );

      toggleColor('red')(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            textColor({ color: 'red' })('text'),
            hardBreak(),
            textColor({ color: 'red' })('here'),
          ),
        ),
      );
    });

    it('sets the text colour to red when none of the selections text colour is red', () => {
      const { editorView } = editor(
        doc(
          p(
            textColor({ color: 'blue' })('{<}text'),
            hardBreak(),
            textColor({ color: 'green' })('here{>}'),
          ),
        ),
      );

      toggleColor('red')(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            textColor({ color: 'red' })('text'),
            hardBreak(),
            textColor({ color: 'red' })('here'),
          ),
        ),
      );
    });

    it('removes the red colour when all toggle same colour', () => {
      const { editorView } = editor(
        doc(
          p(
            textColor({ color: 'red' })('{<}text'),
            hardBreak(),
            textColor({ color: 'red' })('here{>}'),
          ),
        ),
      );

      toggleColor('red')(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('text', hardBreak(), 'here')),
      );
    });
  });
});
