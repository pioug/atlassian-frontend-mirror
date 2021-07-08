import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import {
  doc,
  table,
  p,
  tr,
  th,
  td,
  unsupportedInline,
  unsupportedBlock,
  extension,
  inlineExtension,
  bodiedExtension,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { countNodes } from '../../count-nodes';

describe('#countNodes', () => {
  it('should match empty 3x3 table and a paragraph', () => {
    const editorState = createEditorState(
      doc(
        table()(
          tr(th({})(p()), th({})(p()), th({})(p())),
          tr(td({})(p()), td({})(p()), td({})(p())),
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
        p(),
      ),
    );
    const nodesCount = countNodes(editorState);
    const expected = {
      nodeCount: {
        paragraph: 10,
        table: 1,
        tableCell: 6,
        tableHeader: 3,
        tableRow: 3,
      },
      extensionNodeCount: {},
    };
    expect(nodesCount).toEqual(expected);
  });

  it('should match unsupported contents', () => {
    const editorState = createEditorState(
      doc(p(unsupportedInline({})()), unsupportedBlock({})()),
    );
    const nodesCount = countNodes(editorState);
    const expected = {
      nodeCount: {
        paragraph: 1,
        unsupportedBlock: 1,
        unsupportedInline: 1,
      },
      extensionNodeCount: {},
    };
    expect(nodesCount).toEqual(expected);
  });

  it('should match empty doc', () => {
    const editorState = createEditorState(doc(p('')));
    const nodesCount = countNodes(editorState);
    const expected = {
      nodeCount: { paragraph: 1 },
      extensionNodeCount: {},
    };
    expect(nodesCount).toEqual(expected);
  });

  it('should match existing types of extensions with extension names', () => {
    const editorState = createEditorState(
      doc(
        extension({
          extensionType: 'com.atlassian.extensions.extension',
          extensionKey: '123',
          parameters: {},
        })(),
        extension({
          extensionType: 'com.atlassian.extensions.extension',
          extensionKey: '456',
          parameters: {},
        })(),
        bodiedExtension({
          extensionType: 'com.atlassian.extensions.bodiedExtension',
          extensionKey: '789',
          parameters: {},
        })(p('{<>}')),
        p(
          inlineExtension({
            extensionType: 'com.atlassian.extensions.inlineExtension',
            extensionKey: '101112',
            parameters: {},
          })(),
        ),
      ),
    );
    const nodesCount = countNodes(editorState);
    const extensionNodeCount = {
      'com.atlassian.extensions.extension - 123': 1,
      'com.atlassian.extensions.extension - 456': 1,
      'com.atlassian.extensions.bodiedExtension - 789': 1,
      'com.atlassian.extensions.inlineExtension - 101112': 1,
    };

    const nodeCount = {
      extension: 2,
      inlineExtension: 1,
      bodiedExtension: 1,
      paragraph: 2,
    };

    const expected = {
      nodeCount,
      extensionNodeCount,
    };
    expect(nodesCount).toEqual(expected);
  });
});
