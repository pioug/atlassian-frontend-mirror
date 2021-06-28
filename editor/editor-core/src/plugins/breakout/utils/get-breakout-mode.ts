import { EditorState } from 'prosemirror-state';
import { BreakoutMode } from '../commands/set-breakout-mode';
import { findSupportedNodeForBreakout } from './find-breakout-node';

/**
 * Get the current mode of the breakout at the selection
 * @param state Current EditorState
 */
export function getBreakoutMode(state: EditorState): BreakoutMode | undefined {
  const node = findSupportedNodeForBreakout(state.selection);

  if (!node) {
    return;
  }

  const breakoutMark = node.node.marks.find((m) => m.type.name === 'breakout');

  if (!breakoutMark) {
    return;
  }

  return breakoutMark.attrs.mode;
}
