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
  direction?: SmartLinkDirection;
  size?: SmartLinkSize;
  status?: SmartLinkStatus;
  testId?: string;
  extraCss?: SerializedStyles;
};

export type ElementItem = {
  name: ElementName;
  size?: SmartLinkSize;
  testId?: string;
};

export type BaseActionItem = {
  testId?: string;
  hideContent?: boolean;
  hideIcon?: boolean;
  onClick: () => any;
};

/**
 * Customer can define named action item. Icon and label will be provided implicitly.
 */
export type NamedActionItem = BaseActionItem & {
  name: Exclude<ActionName, ActionName.CustomAction>;
};

/**
 * Customer can define a custom action item. This will require them to specify
 * either `icon` and `iconPosition` OR `content` OR both BUT not neither of those things.
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
