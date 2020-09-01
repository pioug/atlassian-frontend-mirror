export const selectors = {
  annotation: `mark[data-mark-type=annotation]`,
  draftAnnotation: `mark[data-annotation-draft-mark=true]`,
  activeAnnotation: `mark[data-mark-annotation-state=active]`,
  commentButton: `button[data-testid=createInlineCommentButton]`,
  commentPopup: `[aria-label="Popup"]`,
};
