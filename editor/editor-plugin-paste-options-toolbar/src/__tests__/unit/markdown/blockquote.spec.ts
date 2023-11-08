// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  blockquote,
  code,
  doc,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { formatMarkdown } from '../../../util/format-handlers';
import { getDefaultMarkdownPluginState } from '../_testHelpers';

describe('when pasting a blockquote inside an empty paragraph', () => {
  it('should set the selection inside the blockquote', () => {
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

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        // prettier-ignore
        p('Hello World'),
        blockquote(
          p(
            'Dorothy followed her through many of the beautiful rooms in her castle.{<>}',
          ),
        ),
        p('end'),
      ),
    );
  });
});

describe('when pasting a blockquote in an existing paragraph', () => {
  it('should set the selection inside the blockquote', () => {
    const state = createEditorState(
      doc(
        p(
          'Hello',
          code(
            '{<}> Dorothy followed her through many of the beautiful rooms in her castle.{>}',
          ),
          'World',
        ),
      ),
    );
    const plaintext = `> Dorothy followed her through many of the beautiful rooms in her castle.`;

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        // prettier-ignore
        p('Hello{6}'),
        blockquote(
          p(
            'Dorothy followed her through many of the beautiful rooms in her castle.{<>}',
          ),
        ),
        p('World'),
      ),
    );
  });
});

describe('when pasting a blockquote in empty doc', () => {
  it('should set the selection inside the blockquote', () => {
    const state = createEditorState(
      doc(
        p(
          code(
            '{<}> Dorothy followed her through many of the beautiful rooms in her castle.{>}',
          ),
        ),
      ),
    );

    const plaintext = `> Dorothy followed her through many of the beautiful rooms in her castle.`;

    let pluginState = getDefaultMarkdownPluginState();
    pluginState.plaintext = plaintext;
    pluginState.pasteStartPos = state.selection.from;
    pluginState.pasteEndPos = state.selection.to;
    const tr = formatMarkdown(state.tr, pluginState);

    expect(tr).toEqualDocumentAndSelection(
      doc(
        // prettier-ignore
        blockquote(p(
          'Dorothy followed her through many of the beautiful rooms in her castle.{<>}',
        )),
      ),
    );
  });
});
