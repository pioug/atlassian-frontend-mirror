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
import { PluginKey } from 'prosemirror-state';
import basePlugin from '../../';
import emojiPlugin from '../../../emoji';
import tablesPlugin from '../../../table';

const emojiProvider = getTestEmojiResource();
const providerFactory = ProviderFactory.create({ emojiProvider });

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

  it(`should give positions at the current pos when NOT at the end of a 'special' node`, () => {
    const { pluginState, sel } = editorFactory(
      doc(
        table()(
          tr(
            tdEmpty,
            td()(
              p(
                emoji({ shortName: ':smiley:' })(),
                '{<>}',
                ' / ',
                emoji({ shortName: ':smiley:' })(),
              ),
            ),
            tdEmpty,
          ),
        ),
      ),
    );

    expect(pluginState.positions[0]).toEqual(sel - 1);
  });

  it(`should give positions at the current pos when at the end of a 'special' node`, () => {
    const { pluginState, sel } = editorFactory(
      doc(
        table()(
          tr(
            tdEmpty,
            td()(
              p(
                emoji({ shortName: ':smiley:' })(),
                ' / ',
                emoji({ shortName: ':smiley:' })(),
                '{<>}',
              ),
            ),
            tdEmpty,
          ),
        ),
      ),
    );

    expect(pluginState.positions[0]).toEqual(sel - 1);
  });
});
