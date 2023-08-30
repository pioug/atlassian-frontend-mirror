import type { ReactNode } from 'react';

export interface CommentProps {
  /**
   * A list of `CommentAction` items rendered as a row of buttons below the content.
   */
  actions?: Array<ReactNode>;
  /**
   * A `CommentAuthor` element containing the name of the author.
   */
  author?: ReactNode;
  /**
   * The element to display as the avatar - generally an `@atlaskit/avatar`.
   */
  avatar: ReactNode;
  /**
   * Nested comments are to be provided as children.
   */
  children?: ReactNode;
  /**
   * The main content on the comment.
   */
  content?: ReactNode;
  /**
   * Whether this comment should appear highlighted.
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  highlighted?: boolean;
  /**
   * Text for the "restricted to" label. Will display in the top items.
   */
  restrictedTo?: ReactNode;
  /**
   * Enables "optimistic saving" mode which removes actions and displays `savingText` prop.
   */
  isSaving?: boolean;
  /**
   * Text to show when in "optimistic saving" mode.
   */
  savingText?: string;
  /**
   * A `CommentTime` element containing the time to be displayed.
   */
  time?: ReactNode;
  /**
   * Optional hook for automated testing.
   */
  testId?: string;
  /**
   * The type of the comment. This will be rendered in a lozenge at the top of the comment.
   */
  type?: string;
  /**
   * A `CommentEdited` element which displays next to the time. Indicates whether the comment has been edited.
   */
  edited?: ReactNode;
  /**
   * Indicates whether the component is in an error state. Hides actions and time.
   */
  isError?: boolean;
  /**
   * A list of `CommentAction` items rendered with a warning icon instead of the actions.
   */
  errorActions?: Array<ReactNode>;
  /**
   * Text to show in the error icon label.
   */
  errorIconLabel?: string;
  /**
   * An ID to be applied to the comment.
   */
  id?: string;
  /**
   * Content that is rendered after the comment's content.
   */
  afterContent?: ReactNode;
  /**
   * Controls if nested comments are rendered at the same depth as the comment.
   */
  shouldRenderNestedCommentsInline?: boolean;
  /**
   * A semantic heading level to display on this comment (1, 2, 3, 4, 5, 6).
   */
  headingLevel?: string;
}
