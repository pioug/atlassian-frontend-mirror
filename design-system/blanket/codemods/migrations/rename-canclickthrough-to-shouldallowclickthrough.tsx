import { createRenameFuncFor } from '@atlaskit/codemod-utils';

import {
  BLANKET_PACKAGE_NAME,
  NEW_CLICK_THROUGH_PROP_NAME,
  OLD_CLICK_THROUGH_PROP_NAME,
} from '../internal/constants';

export const renameCanClickThrough = createRenameFuncFor(
  BLANKET_PACKAGE_NAME,
  OLD_CLICK_THROUGH_PROP_NAME,
  NEW_CLICK_THROUGH_PROP_NAME,
);
