import { css } from 'styled-components';
import { gridMediumMaxWidth } from '../consts';

const columnLayoutSharedStyle = css`
  [data-layout-section] {
    display: flex;
    flex-direction: row;
    & > * {
      flex: 1;
      min-width: 0;
    }

    @media screen and (max-width: ${gridMediumMaxWidth}px) {
      flex-direction: column;
    }
  }
`;

export { columnLayoutSharedStyle };
