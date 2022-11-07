import {
  doc,
  p,
  emoji,
  table,
  tr,
  td,
  tdEmpty,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import {
  InlineCursorTargetState,
  inlineCursorTargetStateKey,
} from '../../pm-plugins/inline-cursor-target';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { EditorState, PluginKey } from 'prosemirror-state';
import basePlugin from '../../';
import emojiPlugin from '../../../emoji';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';

const emojiProvider = getTestEmojiResource();
const providerFactory = ProviderFactory.create({ emojiProvider });

jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/utils'),
  browser: {
    // The inline-cursor-target plugin only runs under chrome and firefox,
    // mocking the browser.gecko value means it runs (gecko == firefox)
    gecko: true,
  },
}));

describe('Inline cursor target', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editorFactory = (doc: DocBuilder) =>
    createEditor<InlineCursorTargetState, PluginKey>({
      doc,
      providerFactory,
      pluginKey: inlineCursorTargetStateKey,
      preset: new Preset<LightEditorPlugin>()
        .add([basePlugin, { allowInlineCursorTarget: true }])
        .add(emojiPlugin)
        .add(tablesPlugin),
    });

  it(`should create cursor targets when inbetween inline node views with no trailing spaces`, () => {
    const { pluginState } = editorFactory(
      doc(
        table()(
          tr(
            tdEmpty,
            td()(
              p(
                emoji({ shortName: ':smiley:' })(),
                '{<>}',
                emoji({ shortName: ':smiley:' })(),
              ),
            ),
            tdEmpty,
          ),
        ),
      ),
    );

    expect(pluginState.cursorTarget!.decorations.length).toEqual(2);
  });

  it(`should create cursor targets when at the start of a paragraph and next to an inline node view`, () => {
    const { pluginState } = editorFactory(
      doc(
        table()(
          tr(
            tdEmpty,
            td()(
              p(
                '{<>}',
                emoji({ shortName: ':smiley:' })(),
                emoji({ shortName: ':smiley:' })(),
              ),
            ),
            tdEmpty,
          ),
        ),
      ),
    );

    expect(pluginState.cursorTarget).not.toBe(undefined);
  });

  it(`should create cursor targets when selection is after an inline node that is the last child of parent`, () => {
    const { pluginState } = editorFactory(
      doc(
        table()(
          tr(
            tdEmpty,
            td()(
              p(
                emoji({ shortName: ':smiley:' })(),
                emoji({ shortName: ':smiley:' })(),
                '{<>}',
              ),
            ),
            tdEmpty,
          ),
        ),
      ),
    );

    expect(pluginState.cursorTarget).not.toBe(undefined);
  });

  it(`should not create cursor targets when selection is not between inline nodes`, () => {
    const { pluginState } = editorFactory(
      doc(
        table()(
          tr(
            tdEmpty,
            td()(
              p(
                emoji({ shortName: ':smiley:' })(),
                emoji({ shortName: ':smiley:' })(),
                '{<>}',
                ' ',
              ),
            ),
            tdEmpty,
          ),
        ),
      ),
    );

    expect(pluginState.cursorTarget).toBe(undefined);
  });

  it(`should not create cursor targets when inbetween inline node views with trailing spaces`, () => {
    const { pluginState } = editorFactory(
      doc(
        table()(
          tr(
            tdEmpty,
            td()(
              p(
                emoji({ shortName: ':smiley:' })(),
                ' ',
                '{<>}',
                emoji({ shortName: ':smiley:' })(),
              ),
            ),
            tdEmpty,
          ),
        ),
      ),
    );

    expect(pluginState.cursorTarget).toBe(undefined);
  });

  it(`should remove cursor targets when content is entered between inline nodes with no trailing spaces`, () => {
    const getPluginState = (state: EditorState) =>
      inlineCursorTargetStateKey.getState(state);

    const { pluginState, editorView } = editorFactory(
      doc(
        table()(
          tr(
            tdEmpty,
            td()(
              p(
                emoji({ shortName: ':smiley:' })(),
                '{<>}',
                emoji({ shortName: ':smiley:' })(),
              ),
            ),
            tdEmpty,
          ),
        ),
      ),
    );
    const { selection } = editorView.state;

    expect(pluginState.cursorTarget).not.toBe(undefined);
    editorView.dispatch(
      editorView.state.tr.insertText('hello', selection.from),
    );
    expect(getPluginState(editorView.state).cursorTarget).toBe(undefined);
  });
});
