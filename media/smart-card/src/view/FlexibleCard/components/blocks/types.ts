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
  /* The direction that the block should arrange it's elements. Can be vertical or horizontal.*/
  direction?: SmartLinkDirection;
  /* Any additional CSS properties to apply to the block. */
  overrideCss?: SerializedStyles;
  /* The size of the block and the size that the underlying elements should default to.*/
  size?: SmartLinkSize;
  /* The status of the Smart Link. Used to conditionally render different blocks when Smart Link is in different states.*/
  status?: SmartLinkStatus;
  testId?: string;
};

/* Used to represent an Element when passing props into Flexible UI. */
export type ElementItem = {
  /* The name of the element, used by Flexible UI to determine which element to render.
  Should correspond to the Enum of element names, otherwise element will not render. */
  name: ElementName;
  /* The size of the element to render. */
  size?: SmartLinkSize;
  testId?: string;
};

/* Used to represent an Action when passing props into Flexible UI. */
export type BaseActionItem = {
  /* Determines whether the action should hide the text content of the button. */
  hideContent?: boolean;
  /* Determines whether the action should hide the icon inside the button. */
  hideIcon?: boolean;
  /* Determines the onClick behaviour of the action. */
  onClick: () => any;
  /* Additional CSS properties on the Action. */
  overrideCss?: SerializedStyles;
  /* Determines the size of the Action. Corresponds to an Action appearance. */
  size?: SmartLinkSize;
  testId?: string;
};

/**
 * This represents an action where Icon and Content are provided implicitly.
 * @example DeleteAction - by default will contain a cross icon with the 'delete' content if content and icon are not provided.
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
