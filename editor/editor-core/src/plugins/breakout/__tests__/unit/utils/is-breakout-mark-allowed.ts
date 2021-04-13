import {
  doc,
  code_block,
  p,
  expand,
  layoutSection,
  layoutColumn,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { isBreakoutMarkAllowed } from '../../../utils/is-breakout-mark-allowed';

describe('Breakout Commands: getBreakoutMode', () => {
  it('should return true for allowed nodes', () => {
    const editorState = createEditorState(doc(code_block()('Hel{<>}lo')));
    expect(isBreakoutMarkAllowed(editorState)).toBe(true);
  });

  it('should return true for allowed selected nodes', () => {
    const editorState = createEditorState(
      doc('{<node>}', expand({ title: 'hello' })(p('hello'))),
    );
    expect(isBreakoutMarkAllowed(editorState)).toBe(true);
  });

  it(`shouldn't allow breakout on breakout-supported node nested inside breakout-supported node`, () => {
    const editorState = createEditorState(
      doc(
        layoutSection(
          layoutColumn({ width: 50 })(expand()(p('{<>}'))),
          layoutColumn({ width: 50 })(p('')),
        ),
      ),
    );
    expect(isBreakoutMarkAllowed(editorState)).toBe(false);
  });

  it('should return false for not allowed nodes', () => {
    const editorState = createEditorState(doc(p('Hel{<>}lo')));
    expect(isBreakoutMarkAllowed(editorState)).toBe(false);
  });
});
