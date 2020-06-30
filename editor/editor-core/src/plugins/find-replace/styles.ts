import { css } from 'styled-components';
import { B75, B200 } from '@atlaskit/theme/colors';

export const searchMatchBgColour = B75;
export const selectedSearchMatchBgColour = B200;

export const searchMatchClass = 'search-match';
export const selectedSearchMatchClass = 'selected-search-match';

export const findReplaceStyles = css`
  .${searchMatchClass} {
    background-color: ${searchMatchBgColour};
  }

  .${selectedSearchMatchClass} {
    background-color: ${selectedSearchMatchBgColour};
    color: white;
  }
`;
