import { DecorationSet } from 'prosemirror-view';
import { PluginKey } from 'prosemirror-state';

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
  /** Whether find/replace should match case when searching for results */
  shouldMatchCase: boolean;
}

export const findReplacePluginKey = new PluginKey<FindReplacePluginState>(
  'findReplace',
);

export type Match = {
  /** Start position */
  start: number;
  /** End position */
  end: number;
};

export type TextGrouping = {
  /** The concatenated text across nodes */
  text: string;
  /** Start position */
  pos: number;
} | null;

export type FindReplaceOptions = {
  allowMatchCase?: boolean;
};

export type MatchCaseProps = {
  allowMatchCase?: boolean;
  shouldMatchCase?: boolean;
  onToggleMatchCase?: () => void;
};
