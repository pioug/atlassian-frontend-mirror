import styled from 'styled-components';
import { N20 } from '@atlaskit/theme/colors';

export const NameCellWrapper = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
`;

export const TruncateWrapper = styled.div`
  min-width: 0;
  width: 100%;
  margin-left: 4px;

  span:first-of-type {
    &::first-letter {
      text-transform: capitalize;
    }
  }
`;

export const MediaTableWrapper = styled.div`
  tr {
    cursor: pointer;

    &:hover {
      background: ${N20};
    }

    td:empty {
      padding: 0;
    }
  }
`;
