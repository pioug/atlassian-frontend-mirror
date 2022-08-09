import type { EditorView } from 'prosemirror-view';
import type { onItemActivated } from './ui/onItemActivated';

export type ButtonName = 'bullet_list' | 'ordered_list' | 'indent' | 'outdent';

export interface ToolbarProps {
  editorView: EditorView;
  bulletListActive?: boolean;
  bulletListDisabled?: boolean;
  orderedListActive?: boolean;
  orderedListDisabled?: boolean;
  disabled?: boolean;
  isSmall?: boolean;
  isSeparator?: boolean;
  isReducedSpacing?: boolean;
  showIndentationButtons?: boolean;
  indentDisabled?: boolean;
  outdentDisabled?: boolean;
  onItemActivated: typeof onItemActivated;
}
