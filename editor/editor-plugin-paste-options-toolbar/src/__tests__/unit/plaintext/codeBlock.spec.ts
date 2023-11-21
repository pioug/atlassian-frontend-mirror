// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import { code_block, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { formatMarkdown, formatPlainText } from '../../../util/format-handlers';
import {
  getDefaultMarkdownPluginState,
  getDefaultPlainTextPluginState,
} from '../_testHelpers';

describe('when pasting a codeblock inside an empty paragraph', () => {
  it('should convert codeblock into plaintext & set the selection at the end of converted plaintext', () => {
    const state = createEditorState(
      doc(
        p(`Hello World`),
        '{<}',
        code_block()(
          '``` { "firstName": "John", "lastName": "Smith", "age": 25 } ```',
        ),
        p('{>}'),
        p('end'),
      ),
    );

    const ticks = '````';
    const plaintext = `${ticks}
{
"firstName": "John",
"lastName": "Smith",
"age": 25
}
${ticks}`;
    let pluginState = getDefaultPlainTextPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatPlainText(state.tr, pluginState);
    expect(tr).toEqualDocumentAndSelection(
      doc(
        // prettier-ignore
        p('Hello World'),
        p(`${ticks}
{
"firstName": "John",
"lastName": "Smith",
"age": 25
}
${ticks}{<>}`),
        p('end'),
      ),
    );
  });
});

describe('when pasting a codeblock inside an empty doc', () => {
  it('should convert codeblock into plaintext & set the selection at the end of converted plaintext', () => {
    const state = createEditorState(doc(code_block()('{<}Hello world{>}')));
    const plaintext = `Hello world`;
    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);
    expect(tr).toEqualDocumentAndSelection(
      doc(
        // prettier-ignore
        p('Hello world{<>}'),
      ),
    );
  });
});
