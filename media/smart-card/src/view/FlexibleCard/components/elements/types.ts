import { SerializedStyles } from '@emotion/core';

import { SmartLinkSize } from '../../../../constants';

export type ElementProps = {
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
};
