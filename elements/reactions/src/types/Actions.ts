export type ReactionAction = (
  containerAri: string,
  ari: string,
  emojiId: string,
) => void;

export interface OnEmoji {
  (emojiId: string): any;
}

export type OnReaction = (emojiId: string) => void;

export type Actions = {
  getReactions: (containerId: string, aris: string) => void;
  toggleReaction: ReactionAction;
  addReaction: ReactionAction;
  getDetailedReaction: ReactionAction;
};
