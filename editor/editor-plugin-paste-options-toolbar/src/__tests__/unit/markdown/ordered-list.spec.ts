// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  code,
  code_block,
  doc,
  br as hardBreak,
  li,
  ol,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { formatMarkdown } from '../../../util/format-handlers';
import { getDefaultMarkdownPluginState } from '../_testHelpers';

describe('when pasting a markdown list', () => {
  it('set the selection inside the last list item', () => {
    const state = createEditorState(
      doc(
        p(
          `Hello World{<}`,
          code('1. First item'),
          hardBreak(code('')),
          code('2. Second item'),
          hardBreak(code('')),
          code('3. Third item'),
          hardBreak(code('')),
          code('4. Fourth item'),
          '{>}',
        ),
        p(),
      ),
    );
    const plaintext = `1. First item
2. Second item
3. Third item
4. Fourth item`;

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        p('Hello World'),
        ol()(
          li(p('First item')),
          li(p('Second item')),
          li(p('Third item')),
          li(p('Fourth item{<>}')),
        ),
        p(),
      ),
    );
  });
});

describe('when pasting a markdown list with paragrpah', () => {
  it('should set the selection inside the last list item', () => {
    const state = createEditorState(
      doc(
        code_block()(
          '{<}Starting paragraph. 1. First item 2. Second item 3. Third item 4. Fourth item Ending paragraph. With multiple lines.',
        ),
        p('{>}'),
      ),
    );

    const plaintext = `Starting paragraph.


1. First item
2. Second item
3. Third item
4. Fourth item


Ending paragraph.
With multiple lines.
`;

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        p('Starting paragraph.'),
        ol()(
          li(p('First item')),
          li(p('Second item')),
          li(p('Third item')),
          li(p('Fourth item{<>}')),
        ),
        p('Ending paragraph.', hardBreak(), 'With multiple lines.{<>}'),
      ),
    );
  });
});

describe('when pasting a list inside a new paragraph', () => {
  it('should match correct document and selection', () => {
    const state = createEditorState(
      doc(
        p(`Hello World`),
        p(
          '{<}',
          code('1. First item'),
          hardBreak(code('')),
          code('2. Second item'),
          hardBreak(code('')),
          code('3. Third item'),
          hardBreak(code('')),
          code('4. Fourth item'),
          '{>}',
        ),
        p(`Ending paragraph`),
      ),
    );

    const plaintext = `1. First item
2. Second item
3. Third item
4. Fourth item`;

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        p('Hello World'),
        ol()(
          li(p('First item')),
          li(p('Second item')),
          li(p('Third item')),
          li(p('Fourth item{<>}')),
        ),
        p(`Ending paragraph`),
      ),
    );
  });
});
