import styled from 'styled-components';

import { TableHTMLAttributes, ComponentClass } from 'react';

export const Matrix: ComponentClass<TableHTMLAttributes<{}>> = styled.table`
  thead {
    td {
      text-align: center;
      font-weight: bold;
      font-size: 20px;
    }
  }

  tbody {
    td {
      padding: 25px 10px;
    }
  }

  td {
    margin: auto;
    text-align: center;
    vertical-align: middle;

    &:first-child {
      font-weight: bold;
      font-size: 20px;
    }

    > div {
      display: flex;
      justify-content: center;
      text-align: left;
    }
  }
`;
