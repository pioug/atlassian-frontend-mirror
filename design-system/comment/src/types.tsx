import type { ReactNode } from 'react';

export interface CommentProps {
  /**
   * An list of CommentAction items rendered as a row of buttons below the comment content
   */
  actions?: Array<ReactNode>;
  /**
   * A CommentAuthor element containing the name of the comment author.
   */
  author?: ReactNode;
  /**
   * The element to display as the Comment avatar - generally an Atlaskit Avatar
   */
  avatar: ReactNode;
  /**
   * Nested comments should be provided as children of the Comment
   */
  children?: ReactNode;
  /**
   * The main content of the Comment
   */
  content?: ReactNode;
  /**
   * Whether this comment should appear highlighted
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  highlighted?: boolean;
  /**
   * Text to show in the "restricted to" label. Will display in the top items
   */
  restrictedTo?: ReactNode;
  /**
   * Enable "optimistic saving" mode, remove actions and show `savingText` prop
   */
  isSaving?: boolean;
  /**
   * Text to show when in "optimistic saving" mode
   */
  savingText?: string;
  /**
   * A CommentTime element containing the time to be displayed
   */
  time?: ReactNode;
  /**
   * Optional hook for automated testing.
   */
  testId?: string;
  /**
   * The type of the comment - will be rendered in a lozenge at the top of the Comment
   */
  type?: string;
  /**
   * will be rendered beside the time to show whether the comment is edited or not
   */
  edited?: ReactNode;
  /**
   * Indicates whether the component is in an error state - hides actions and time
   */
  isError?: boolean;
  /**
   * A list of CommentAction items rendered with a warning icon instead of the actions
   */
  errorActions?: Array<ReactNode>;
  /**
   * Text to show in the error icon label
   */
  errorIconLabel?: string;
  /**
   * Optional ID for the comment
   */
  id?: string;
  /**
   * Optional content that is rendered after the comment's content
   */
  afterContent?: ReactNode;
  /**
   * Optional boolean to render any child comments at the same level as this comment
   */
  shouldRenderNestedCommentsInline?: boolean;
  /**
   * Optional semantic heading level to add to this comment (1, 2, 3 etc). Default is no heading
   */
  headingLevel?: string;
}
