// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  code_block,
  breakout,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { getBreakoutMode } from '../../../utils/get-breakout-mode';

describe('Breakout Commands: getBreakoutMode', () => {
  it('should return a breakout mode of current node', () => {
    const editorState = createEditorState(
      doc(breakout({ mode: 'wide' })(code_block()('Hel{<>}lo'))),
    );
    expect(getBreakoutMode(editorState)).toEqual('wide');
  });

  it('should return undefined for not breakout node', () => {
    const editorState = createEditorState(doc(code_block()('Hel{<>}lo')));
    expect(getBreakoutMode(editorState)).toBeUndefined();
  });
});
