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
	 * The element to display as the avatar. It's best to use `@atlaskit/avatar`.
	 */
	avatar: ReactNode;
	/**
	 * Provide nested comments as children.
	 */
	children?: ReactNode;
	/**
	 * The main content for the comment.
	 */
	content?: ReactNode;
	/**
	 * Sets whether this comment should be highlighted.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	highlighted?: boolean;
	/**
	 * Text for the "restricted to" label. This will display in the top items, before the main content.
	 */
	restrictedTo?: ReactNode;
	/**
	 * Enables "optimistic saving" mode which removes actions and displays text from the `savingText` prop.
	 */
	isSaving?: boolean;
	/**
	 * Text to show when in "optimistic saving" mode.
	 */
	savingText?: string;
	/**
	 * A `CommentTime` element containing the time to display.
	 */
	time?: ReactNode;
	/**
	 * Optional hook for automated testing.
	 */
	testId?: string;
	/**
	 * The type of comment. This will be rendered in a lozenge at the top of the comment, before the main content.
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
	 * Controls if nested comments are rendered at the same depth as the parent comment.
	 */
	shouldRenderNestedCommentsInline?: boolean;
	/**
	 * Use this to set the semantic heading level of the comment. The default comment heading has an `h3` tag. Make sure that headings are in the correct order and don’t skip levels.
	 */
	headingLevel?: '1' | '2' | '3' | '4' | '5' | '6';
}
