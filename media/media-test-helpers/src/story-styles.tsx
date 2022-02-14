import styled from '@emotion/styled';

export const Matrix = styled.table`
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
