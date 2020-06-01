import styled from 'styled-components';

export const NameCellWrapper = styled.div`
  display: flex;
  align-content: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const NameCell = styled.div`
  display: flex;
  align-content: center;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    &::first-letter {
      text-transform: uppercase;
    }
  }
`;

export const MediaTableWrapper = styled.div`
  tr {
    cursor: pointer;
  }
`;
