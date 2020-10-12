import { ReactionsReadyState } from '../types/ReactionsState';
import { ReactionStatus } from '../types/ReactionStatus';
import { ReactionSummary } from '../types/ReactionSummary';
import { Updater } from '../types/Updater';

export const compareEmojiId = (l: string, r: string): number => {
  return l.localeCompare(r);
};

export type ReactionSummarySortFunction = (
  a: ReactionSummary,
  b: ReactionSummary,
) => number;

export const sortByRelevance: ReactionSummarySortFunction = (
  a: ReactionSummary,
  b: ReactionSummary,
) => {
  if (a.count > b.count) {
    return -1;
  } else if (a.count < b.count) {
    return 1;
  } else {
    return compareEmojiId(a.emojiId, b.emojiId);
  }
};

export const sortByPreviousPosition = (
  reactions: ReactionSummary[],
): ReactionSummarySortFunction => {
  type Indexes = { [emojiId: string]: number };
  const indexes: Indexes = reactions.reduce((map, reaction, index) => {
    map[reaction.emojiId] = index;
    return map;
  }, {} as Indexes);

  const getPosition = ({ emojiId }: ReactionSummary) =>
    indexes[emojiId] === undefined ? reactions.length : indexes[emojiId];

  return (a, b) => getPosition(a) - getPosition(b);
};

export const readyState = (
  reactions: ReactionSummary[],
): ReactionsReadyState => ({
  status: ReactionStatus.ready,
  reactions: reactions.filter(reaction => reaction.count > 0),
});

export const byEmojiId = (emojiId: string) => (reaction: ReactionSummary) =>
  reaction.emojiId === emojiId;

export const addOne = (reaction: ReactionSummary): ReactionSummary => ({
  ...reaction,
  count: reaction.count + 1,
  reacted: true,
});

export const removeOne = (reaction: ReactionSummary): ReactionSummary => ({
  ...reaction,
  count: reaction.count - 1,
  reacted: false,
});

export const updateByEmojiId = (
  emojiId: string,
  updater: Updater<ReactionSummary> | ReactionSummary,
) => (reaction: ReactionSummary) =>
  reaction.emojiId === emojiId
    ? updater instanceof Function
      ? updater(reaction)
      : updater
    : reaction;

export const getReactionsSortFunction = (reactions?: ReactionSummary[]) =>
  reactions && reactions.length
    ? sortByPreviousPosition(reactions)
    : sortByRelevance;

export const flattenAris = (a: string[], b: string[]): string[] => a.concat(b);
