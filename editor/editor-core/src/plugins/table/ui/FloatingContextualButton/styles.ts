import { css } from '@emotion/react';
import { N0, N20 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { contextualMenuTriggerSize } from '../consts';
import { token } from '@atlaskit/tokens';

// TODO: https://product-fabric.atlassian.net/browse/DSP-4462
export const tableFloatingCellButtonStyles = css`
  > div {
    background: ${token('color.background.neutral', N20)};
    border-radius: ${borderRadius()}px;
    border: 2px solid ${token('color.border.inverse', N0)};
    display: flex;
    height: ${contextualMenuTriggerSize - 2}px;
    flex-direction: column;
  }
  && button {
    flex-direction: column;
    padding: 0;
    height: 100%;
    display: flex;
  }
  && button > span {
    margin: 0px -4px;
  }
  && span {
    pointer-events: none;
  }
`;
