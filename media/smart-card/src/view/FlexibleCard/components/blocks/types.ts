import {
  ActionName,
  ElementName,
  SmartLinkDirection,
  SmartLinkSize,
  SmartLinkStatus,
} from '../../../../constants';

export type BlockProps = {
  direction?: SmartLinkDirection;
  size?: SmartLinkSize;
  status?: SmartLinkStatus;
  testId?: string;
};

export type ElementItem = {
  name: ElementName;
  size?: SmartLinkSize;
  testId?: string;
};

export type ActionItem = {
  name: ActionName;
  testId?: string;
  hideContent?: boolean;
  hideIcon?: boolean;
  onClick: () => any;
};
