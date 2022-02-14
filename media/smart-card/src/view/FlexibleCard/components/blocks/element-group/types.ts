import {
  SmartLinkAlignment,
  SmartLinkDirection,
  SmartLinkSize,
  SmartLinkWidth,
} from '../../../../../constants';

export type ElementGroupProps = {
  align?: SmartLinkAlignment;
  direction?: SmartLinkDirection;
  size?: SmartLinkSize;
  testId?: string;
  width?: SmartLinkWidth;
};
