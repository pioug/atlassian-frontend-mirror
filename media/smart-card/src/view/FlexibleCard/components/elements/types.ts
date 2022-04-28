import { SerializedStyles } from '@emotion/core';

import { SmartLinkSize } from '../../../../constants';

export type ElementProps = {
  /* Any additional CSS properties to apply to the element. */
  overrideCss?: SerializedStyles;
  /* The size of the element to display. */
  size?: SmartLinkSize;
  testId?: string;
};
