// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  code_block,
  doc,
  li,
  p,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { formatMarkdown } from '../../../util/format-handlers';
import { getDefaultMarkdownPluginState } from '../_testHelpers';

describe('when pasting a bullet list with a paragrpah', () => {
  it('should set the selection inside the last list item', () => {
    const state = createEditorState(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        code_block()(`{<}some initial text

            - First item
            - Second item
            - Third item
            - Fourth item

            some final text`),
        p('{>}'),
        p('consectetur adipiscing elit.'),
      ),
    );

    const plaintext = `
some initial text

- First item
- Second item
- Third item
- Fourth item

some final text
      `;

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        p('some initial text'),
        ul(
          li(p('First item')),
          li(p('Second item')),
          li(p('Third item')),
          li(p('Fourth item')),
        ),
        p('some final text'),
        p('consectetur adipiscing elit.'),
      ),
    );
  });
});
