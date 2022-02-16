import { Interpolation } from '@emotion/core';

import {
  SmartLinkAlignment,
  SmartLinkDirection,
  SmartLinkSize,
  SmartLinkWidth,
} from '../../../../../constants';

export type ElementGroupProps = {
  align?: SmartLinkAlignment;
  css?: Interpolation;
  direction?: SmartLinkDirection;
  size?: SmartLinkSize;
  testId?: string;
  width?: SmartLinkWidth;
};
