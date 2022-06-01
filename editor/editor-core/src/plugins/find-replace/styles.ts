/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */

// TODO: https://product-fabric.atlassian.net/browse/DSP-4290
import { css } from '@emotion/react';
import { B75, B200 } from '@atlaskit/theme/colors';

export const searchMatchClass = 'search-match';
export const selectedSearchMatchClass = 'selected-search-match';

export const findReplaceStyles = css`
  .${searchMatchClass} {
    background-color: ${B75};
  }

  .${selectedSearchMatchClass} {
    background-color: ${B200};
    color: white;
  }
`;
