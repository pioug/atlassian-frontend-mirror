import { type ReactNode, type Ref } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type SerializedStyles } from '@emotion/react';

import {
	type ActionName,
	type ElementName,
	type SmartLinkDirection,
	type SmartLinkSize,
	type SmartLinkStatus,
} from '../../../../constants';
import { type ActionProps } from '../actions/action/types';

export type BlockProps = {
	/**
	 * React children
	 */
	children?: ReactNode | undefined;

	/**
	 * The direction that the block should arrange its elements. Can be vertical
	 * or horizontal. Default is horizontal.
	 * @internal
	 */
	direction?: SmartLinkDirection;

	/**
	 * Any additional CSS properties to apply to the block.
	 * The use of this prop is **strongly** discouraged.
	 * `@emotion/react` will be replaced with compiled.
	 */
	overrideCss?: SerializedStyles;

	/**
	 * The size of the block and the size that the underlying elements should
	 * default to.
	 */
	size?: SmartLinkSize;

	/**
	 * The status of the Smart Link. Used to conditionally render different blocks
	 * when Smart Link is in different states.
	 * @internal
	 */
	status?: SmartLinkStatus;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Ref to block wrapper div.
	 */
	blockRef?: Ref<HTMLDivElement>;

	/**
	 * Function to be called on render of block.
	 * @internal
	 */
	onRender?: () => void;

	/**
	 * Function to be called on transition end of block.
	 * @internal
	 */
	onTransitionEnd?: () => void;
};

/**
 * Used to represent a metadata element to be rendered.
 */
export type ElementItem = {
	/**
	 * Any additional CSS properties to apply to the element.
	 */
	overrideCss?: SerializedStyles;

	/**
	 * The size of the element to display.
	 */
	size?: SmartLinkSize;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
} & ElementItemProps;

/**
 * Used to represent an Action when passing props into Flexible UI.
 */
export type BaseActionItem = {
	/**
	 * Determines whether the action should hide the text content of the button.
	 */
	hideContent?: boolean;

	/**
	 * Determines whether the action should hide the icon inside the button.
	 */
	hideIcon?: boolean;

	/**
	 * Determines where the icon should be rendered if text is provided.
	 */
	iconPosition?: 'before' | 'after';

	/**
	 * Determines the text and icon representation of the action, with exception
	 * to CustomAction.
	 */
	name: ActionName;

	/**
	 * Determines the onClick behaviour of the action.
	 */
	onClick: () => any;

	/**
	 * Determines the text content of the Action.
	 */
	content?: React.ReactNode;

	/**
	 * Additional CSS properties on the Action.
	 */
	overrideCss?: SerializedStyles;

	/**
	 * Determines the size of the Action. Corresponds to an Action appearance.
	 */
	size?: SmartLinkSize;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Determines whether the button displays as disabled.
	 */
	isDisabled?: boolean;
};

/**
 * Used to represent an Action which self-hydrates with data when passing props into Flexible UI.
 */
export type BaseDataActionItem = {
	/**
	 * Determines whether the action should hide the text content of the button.
	 */
	hideContent?: boolean;

	/**
	 * Determines whether the action should hide the icon inside the button.
	 */
	hideIcon?: boolean;

	/**
	 * Determines the text and icon representation of the action, with exception
	 * to CustomAction.
	 */
	name: ActionName;

	/**
	 * Determines the onClick behaviour of the action. This is optional because
	 * the onClick functionality will be hydrated by the action by default.
	 */
	onClick?: () => any;

	/**
	 * Additional CSS properties on the Action.
	 */
	overrideCss?: SerializedStyles;

	/**
	 * Determines the size of the Action. Corresponds to an Action appearance.
	 */
	size?: SmartLinkSize;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Determines whether the button displays as disabled.
	 */
	isDisabled?: boolean;
};

/**
 * This represents an action that will render based on the data provided from the Smart Link.
 * Icon and Content are also provided implicitly.
 * @example PreviewAction - by default will contain a fullscreen icon with the 'Preview'
 * content if content and icon are not provided. This also will add a button that
 * renders a preview modal when clicked.
 */
export type NamedDataActionItem = BaseDataActionItem & {
	name:
		| ActionName.FollowAction
		| ActionName.PreviewAction
		| ActionName.DownloadAction
		| ActionName.AutomationAction
		| ActionName.CopyLinkAction;
};

/**
 * This represents an action that does not fetch data where Icon and Content are provided implicitly.
 * @example DeleteAction - by default will contain a cross icon with the
 * 'delete' content if content and icon are not provided.
 */
export type NamedActionItem = BaseActionItem & {
	name: ActionName.DeleteAction | ActionName.EditAction;
};

/**
 * This represents an action where either Icon or label must be provided.
 */
export type CustomActionItem = BaseActionItem & {
	name: ActionName.CustomAction;
	href?: string;
	ariaLabel?: string;
} & (
		| (Required<Pick<ActionProps, 'icon' | 'iconPosition'>> & Pick<ActionProps, 'content'>)
		| ((Required<Pick<ActionProps, 'content'>> & Pick<ActionProps, 'icon' | 'iconPosition'>) &
				Pick<ActionProps, 'tooltipMessage'>)
	);

export type ActionItem = (NamedActionItem | NamedDataActionItem | CustomActionItem) & {
	entryPointWrapper?: React.FC<{ children: React.ReactNode }>;
};

export type OnActionMenuOpenChangeOptions = {
	isOpen: boolean;
};

/**
 * A type that contains all the possible combinations of elements with their corresponding props.
 */
export type ElementItemProps =
	| AssignedTo
	| AssignedToGroup
	| AttachmentCount
	| AuthorGroup
	| ChecklistProgress
	| CollaboratorGroup
	| CommentCount
	| CreatedBy
	| CreatedOn
	| DueOn
	| LatestCommit
	| LinkIcon
	| Location
	| ModifiedBy
	| ModifiedOn
	| OwnedBy
	| OwnedByGroup
	| Preview
	| Priority
	| ProgrammingLanguage
	| Provider
	| ReactCount
	| ReadTime
	| SentOn
	| Snippet
	| SourceBranch
	| State
	| SubscriberCount
	| SubTasksProgress
	| StoryPoints
	| TargetBranch
	| Title
	| ViewCount
	| VoteCount;

/**
 * Represents the props available for an AttachmentCount element.
 * @see AttachmentCount
 */
export type AttachmentCount = {
	name: ElementName.AttachmentCount;
};
/**
 * Represents the props available for an AuthorGroup element.
 * @see AuthorGroup
 */
export type AuthorGroup = {
	name: ElementName.AuthorGroup;
	/**
	 * Shows a name prefix Created by in the Avatar tooltip.
	 */
	showNamePrefix?: boolean;
};
/**
 * Represents the props available for an OwnedByGroup element.
 * @see AuthorGroup
 */
export type OwnedByGroup = {
	name: ElementName.OwnedByGroup;
	/**
	 * Shows a name prefix Owned by in the Avatar tooltip.
	 */
	showNamePrefix?: boolean;
};
/**
 * Represents the props available for an AssignedToGroup element.
 * @see AuthorGroup
 */
export type AssignedToGroup = {
	name: ElementName.AssignedToGroup;
	/**
	 * Shows a name prefix Assigned To in the Avatar tooltip.
	 */
	showNamePrefix?: boolean;
	/**
	 * Shows a default unassigned fallback avatar when no person is assigned.
	 */
	showFallbackAvatar?: boolean;
};

/**
 * Represents the props available for an ChecklistProgress element.
 * @see ChecklistProgress
 */
export type ChecklistProgress = {
	name: ElementName.ChecklistProgress;
};
/**
 * Represents the props available for an CollaboratorGroup element.
 * @see CollaboratorGroup
 */
export type CollaboratorGroup = {
	name: ElementName.CollaboratorGroup;
};
/**
 * Represents the props available for an CommentCount element.
 * @see CommentCount
 */
export type CommentCount = {
	name: ElementName.CommentCount;
};
/**
 * Represents the props available for an AssignedTo element.
 * @see AssignedTo
 */
export type AssignedTo = {
	name: ElementName.AssignedTo;
};
/**
 * Represents the props available for an CreatedBy element.
 * @see CreatedBy
 */
export type CreatedBy = {
	name: ElementName.CreatedBy;
};
/**
 * Represents the props available for an OwnedBy element.
 * @see OwnedBy
 */
export type OwnedBy = {
	name: ElementName.OwnedBy;
};
/**
 * Represents the props available for an CreatedOn element.
 * @see CreatedOn
 */
export type CreatedOn = {
	name: ElementName.CreatedOn;
	/**
	 * A string which will be displayed before the specified element.
	 */
	text?: string;
};
/**
 * Represents the props available for an DueOn element.
 * @see CreatedOn
 */
export type DueOn = {
	name: ElementName.DueOn;
};
/**
 * Represents the props available for an LastCommit element.
 * @see BadgeProps
 */
export type LatestCommit = {
	name: ElementName.LatestCommit;
};
/**
 * Represents the props available for an LinkIcon element.
 * @see LinkIcon
 */
export type LinkIcon = {
	name: ElementName.LinkIcon;
};
/**
 * Represents the props for the Location element.
 */
export type Location = {
	name: ElementName.Location;
};
/**
 * Represents the props available for an ModifiedBy element.
 * @see ModifiedBy
 */
export type ModifiedBy = {
	name: ElementName.ModifiedBy;
};
/**
 * Represents the props available for an ModifiedOn element.
 * @see ModifiedOn
 */
export type ModifiedOn = {
	name: ElementName.ModifiedOn;
	/**
	 * A string which will be displayed before the specified element.
	 */
	text?: string;
};
/**
 * Represents the props available for an Preview element.
 * @see Preview
 */
export type Preview = {
	name: ElementName.Preview;
};
/**
 * Represents the props available for an Priority element.
 * @see Priority
 */
export type Priority = {
	name: ElementName.Priority;
};
/**
 * Represents the props available for an ProgrammingLanguage element.
 * @see ProgrammingLanguage
 */
export type ProgrammingLanguage = {
	name: ElementName.ProgrammingLanguage;
};
/**
 * Represents the props available for a Provider element.
 * @see Provider
 */
export type Provider = {
	name: ElementName.Provider;
	hideIcon?: boolean;
};
/**
 * Represents the props available for an ReactCount element.
 * @see ReactCount
 */
export type ReactCount = {
	name: ElementName.ReactCount;
};
/**
 * Represents the props available for a ReadTime element.
 */
export type ReadTime = {
	name: ElementName.ReadTime;
};
/**
 * Represents the props available for an SentOn element.
 * @see SentOn
 */
export type SentOn = {
	name: ElementName.SentOn;
};
/**
 * Represents the props available for an Snippet element.
 * @see Snippet
 */
export type Snippet = {
	name: ElementName.Snippet;
};
/**
 * Represents the props available for an SourceBranch element.
 * @see SourceBranch
 */
export type SourceBranch = {
	name: ElementName.SourceBranch;
};
/**
 * Represents the props available for an State element.
 * @see State
 */
export type State = {
	name: ElementName.State;
};
/**
 * Represents the props available for a SubscriberCount element.
 * @see SubscriberCount
 */
export type SubscriberCount = {
	name: ElementName.SubscriberCount;
};
/**
 * Represents the props available for a SubtasksProgress element.
 */
export type SubTasksProgress = {
	name: ElementName.SubTasksProgress;
};
/**
 * Represents the props available for a StoryPoints element.
 */
export type StoryPoints = {
	name: ElementName.StoryPoints;
};
/**
 * Represents the props available for an TargetBranch element.
 * @see TargetBranch
 */
export type TargetBranch = {
	name: ElementName.TargetBranch;
};
/**
 * Represents the props available for an Title element.
 * @see Title
 */
export type Title = {
	name: ElementName.Title;
};
/**
 * Represents the props available for an ViewCount element.
 * @see ViewCount
 */
export type ViewCount = {
	name: ElementName.ViewCount;
};
/**
 * Represents the props available for an VoteCount element.
 * @see VoteCount
 */
export type VoteCount = {
	name: ElementName.VoteCount;
};
