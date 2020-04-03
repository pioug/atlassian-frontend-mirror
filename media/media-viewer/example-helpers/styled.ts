import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
export const Group = styled.div`
  width: 250px;
  padding: 20px;
`;

export const ButtonList = styled.ul`
  padding-left: 0;
  list-style: none;
`;

export const MVSidebar = styled.div`
  height: calc(100vh - 64px);
  padding: 32px;
  overflow: auto;

  h2 {
    color: white;
    margin-bottom: 16px;
  }

  tbody {
    border-bottom: none;
    vertical-align: top;
  }
`;

export const MVSidebarHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
