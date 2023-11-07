import type { DocBuilder } from '@atlaskit/editor-common/types';
import { codeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { Slice } from '@atlaskit/editor-prosemirror/model';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { code_block, doc } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import defaultSchema from '@atlaskit/editor-test-helpers/schema';

import { pluginKey } from '../../plugin-key';

jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/utils'),
  browser: {
    gecko: true,
  },
}));

describe('code-block', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      pluginKey: pluginKey,
      preset: new Preset<LightEditorPlugin>()
        .add(decorationsPlugin)
        .add(compositionPlugin)
        .add([codeBlockPlugin, { appearance: 'full-page' }]),
    });
  };

  beforeEach(() => {
    jest.spyOn(window, 'getSelection');
  });

  afterEach(() => {
    (window.getSelection as any).mockRestore();
  });

  it('it should refresh dom selection if browser is firefox', () => {
    const removeAllRangesMock = jest.fn();
    const addRangeMock = jest.fn();
    (window.getSelection as any).mockReturnValue({
      removeAllRanges: removeAllRangesMock,
      addRange: addRangeMock,
      rangeCount: 1,
      getRangeAt: () => ({
        cloneRange: () => ({ startOffset: 1, endOffset: 2 }),
      }),
    });

    const { editorView } = editor(doc(code_block()('{{<>}}')));

    editorView.dispatch(
      editorView.state.tr.replaceSelection(
        Slice.fromJSON(defaultSchema, { type: 'text', text: '\n' }),
      ),
    );

    expect(removeAllRangesMock).toHaveBeenCalledTimes(1);
    expect(addRangeMock).toHaveBeenCalledWith({ startOffset: 1, endOffset: 2 });
  });
});
