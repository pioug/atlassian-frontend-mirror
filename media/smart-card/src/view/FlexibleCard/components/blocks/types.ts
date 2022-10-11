import {
  ActionName,
  ElementName,
  SmartLinkDirection,
  SmartLinkSize,
  SmartLinkStatus,
} from '../../../../constants';
import { SerializedStyles } from '@emotion/react';
import { ActionProps } from '../actions/action/types';
import { Ref } from 'react';

export type BlockProps = {
  /**
   * The direction that the block should arrange it's elements. Can be vertical
   * or horizontal. Default is horizontal.
   * @internal
   */
  direction?: SmartLinkDirection;

  /**
   * Any additional CSS properties to apply to the block.
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
   * Determines the text and icon representation of the action, with exception
   * to CustomAction.
   */
  name: ActionName;

  /**
   * Determines the onClick behaviour of the action.
   */
  onClick: () => any;

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
};

/**
 * This represents an action where Icon and Content are provided implicitly.
 * @example DeleteAction - by default will contain a cross icon with the
 * 'delete' content if content and icon are not provided.
 */
export type NamedActionItem = BaseActionItem & {
  name: Exclude<ActionName, ActionName.CustomAction>;
};

/**
 * This represents an action where either Icon or label must be provided.
 */
export type CustomActionItem = BaseActionItem & {
  name: ActionName.CustomAction;
} & (
    | (Required<Pick<ActionProps, 'icon' | 'iconPosition'>> &
        Pick<ActionProps, 'content'>)
    | ((Required<Pick<ActionProps, 'content'>> &
        Pick<ActionProps, 'icon' | 'iconPosition'>) &
        Pick<ActionProps, 'tooltipMessage'>)
  );

export type ActionItem = NamedActionItem | CustomActionItem;

export type OnActionMenuOpenChangeOptions = {
  isOpen: boolean;
};

/**
 * A type that contains all the possible combinations of elements with their corresponding props.
 */
export type ElementItemProps =
  | AuthorGroup
  | CollaboratorGroup
  | CommentCount
  | CreatedBy
  | CreatedOn
  | DueOn
  | LatestCommit
  | LinkIcon
  | ModifiedBy
  | ModifiedOn
  | Preview
  | Priority
  | ProgrammingLanguage
  | Provider
  | ReactCount
  | Snippet
  | SourceBranch
  | State
  | SubscriberCount
  | TargetBranch
  | Title
  | ViewCount
  | VoteCount;

/**
 * Represents the props available for an AuthorGroup element.
 * @see AuthorGroup
 */
export type AuthorGroup = {
  name: ElementName.AuthorGroup;
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
 * Represents the props available for an CreatedBy element.
 * @see CreatedBy
 */
export type CreatedBy = {
  name: ElementName.CreatedBy;
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
 * Represents the props available for an Provider element.
 * @see Provider
 */
export type Provider = {
  name: ElementName.Provider;
};
/**
 * Represents the props available for an ReactCount element.
 * @see ReactCount
 */
export type ReactCount = {
  name: ElementName.ReactCount;
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
 * Represents the props available for an SubscriberCount element.
 * @see SubscriberCount
 */
export type SubscriberCount = {
  name: ElementName.SubscriberCount;
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
