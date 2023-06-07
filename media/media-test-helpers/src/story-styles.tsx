import styled from '@emotion/styled';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
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
