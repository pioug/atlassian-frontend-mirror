// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  blockquote,
  code,
  doc,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { formatPlainText } from '../../../util/format-handlers';
import { getDefaultPlainTextPluginState } from '../_testHelpers';

describe('when pasting a blockquote inside an empty doc', () => {
  it('should convert blockquote into plaintext & set the selection at the end of converted plaintext', () => {
    const state = createEditorState(
      doc(
        '{<}',
        blockquote(
          p(
            'Dorothy followed her through many of the beautiful rooms in her castle.',
          ),
        ),
        '{>}',
      ),
    );
    const plaintext = `> Dorothy followed her through many of the beautiful rooms in her castle.`;
    let pluginState = getDefaultPlainTextPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatPlainText(state.tr, pluginState);
    expect(tr).toEqualDocumentAndSelection(
      doc(
        p(
          '> Dorothy followed her through many of the beautiful rooms in her castle.{<>}',
        ),
      ),
    );
  });
});

describe('when pasting a blockquote inside an empty paragraph', () => {
  it('should convert blockquote into plaintext & set the selection at the end of converted plaintext', () => {
    const state = createEditorState(
      doc(
        p(`Hello World`),
        p(
          '{<}',
          code(
            '> Dorothy followed her through many of the beautiful rooms in her castle.',
          ),
          '{>}',
        ),
        p('end'),
      ),
    );
    const plaintext = `> Dorothy followed her through many of the beautiful rooms in her castle.`;

    let pluginState = getDefaultPlainTextPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatPlainText(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        p('Hello World'),
        p(
          '> Dorothy followed her through many of the beautiful rooms in her castle.{<>}',
        ),
        p('end'),
      ),
    );
  });
});
