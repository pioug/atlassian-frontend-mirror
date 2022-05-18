import {
  ActionName,
  ElementName,
  SmartLinkDirection,
  SmartLinkSize,
  SmartLinkStatus,
} from '../../../../constants';
import { SerializedStyles } from '@emotion/core';
import { ActionProps } from '../actions/action/types';

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
};

/**
 * Used to represent a metadata element to be rendered.
 */
export type ElementItem = {
  /**
   * The name of the metadata element, used by Flexible UI to determine which
   * element to render.
   */
  name:
    | ElementName.AuthorGroup
    | ElementName.CollaboratorGroup
    | ElementName.CommentCount
    | ElementName.CreatedBy
    | ElementName.CreatedOn
    | ElementName.ModifiedBy
    | ElementName.ModifiedOn
    | ElementName.Priority
    | ElementName.ProgrammingLanguage
    | ElementName.Provider
    | ElementName.ReactCount
    | ElementName.State
    | ElementName.SubscriberCount
    | ElementName.ViewCount
    | ElementName.VoteCount;

  /**
   * The size of the element to render.
   * The elements that support sizing are AuthorGroup and CollaboratorGroup.
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
