import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { emojiPlugin } from '@atlaskit/editor-plugin-emoji';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type {
  EditorState,
  PluginKey,
} from '@atlaskit/editor-prosemirror/state';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  emoji,
  p,
  table,
  td,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import selectionPlugin from '../../../../editor-core/src/plugins/selection';
// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import typeAheadPlugin from '../../../../editor-core/src/plugins/type-ahead';
import { basePlugin } from '../../index';
import type { InlineCursorTargetState } from '../../pm-plugins/inline-cursor-target';
import { inlineCursorTargetStateKey } from '../../pm-plugins/inline-cursor-target';

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
  const preset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([analyticsPlugin, {}])
    .add(contentInsertionPlugin)
    .add([basePlugin, { allowInlineCursorTarget: true }])
    .add(typeAheadPlugin)
    .add(emojiPlugin)
    .add(widthPlugin)
    .add(guidelinePlugin)
    .add(selectionPlugin)
    .add(tablesPlugin);

  const editorFactory = (doc: DocBuilder) =>
    createEditor<InlineCursorTargetState, PluginKey, typeof preset>({
      doc,
      providerFactory,
      pluginKey: inlineCursorTargetStateKey,
      preset,
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
