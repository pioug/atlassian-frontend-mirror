import { DecorationSet } from 'prosemirror-view';
import { PluginKey } from 'prosemirror-state';

export const findReplacePluginKey = new PluginKey('findReplace');

export interface FindReplacePluginState {
  /** Whether find/replace is active, i.e. displayed */
  isActive: boolean;
  /**
   * Whether we should set focus into and select all text of find textfield
   * This will be true if user highlights a word and hits cmd+f
   */
  shouldFocus: boolean;
  /** Search keyword */
  findText: string;
  /** Text to replace with */
  replaceText: string;
  /** Index of selected word in array of matches, this gets updated as user finds next/prev */
  index: number;
  /** Positions of find results */
  matches: Match[];
  /** Decorations for the search results */
  decorationSet: DecorationSet;
  /** Element (if any) that has focus in find/replace popup */
  focusElementRef: React.RefObject<HTMLElement> | undefined;
}

export type Match = {
  /** Start position */
  start: number;
  /** End position */
  end: number;
};
