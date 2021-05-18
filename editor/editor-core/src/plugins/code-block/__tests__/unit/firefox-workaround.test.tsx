import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
jest.mock('@atlaskit/editor-common', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common'),
  browser: {
    gecko: true,
  },
}));
import codeBlockPlugin from '../..';

import {
  doc,
  code_block,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { pluginKey } from '../../plugin-key';
import { Slice } from 'prosemirror-model';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';

describe('code-block', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      pluginKey: pluginKey,
      preset: new Preset<LightEditorPlugin>().add(codeBlockPlugin),
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
