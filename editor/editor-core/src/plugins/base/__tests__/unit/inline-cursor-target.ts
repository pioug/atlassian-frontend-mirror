import {
  doc,
  p,
  emoji,
  table,
  tr,
  td,
  tdEmpty,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import { emoji as emojiData } from '@atlaskit/util-data-test';
import {
  InlineCursorTargetState,
  inlineCursorTargetStateKey,
} from '../../pm-plugins/inline-cursor-target';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { PluginKey } from 'prosemirror-state';
import basePlugin from '../../';
import emojiPlugin from '../../../emoji';
import tablesPlugin from '../../../table';

const emojiProvider = emojiData.testData.getEmojiResourcePromise();
const providerFactory = ProviderFactory.create({ emojiProvider });

describe('Inline cursor target', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editorFactory = (doc: any) =>
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
