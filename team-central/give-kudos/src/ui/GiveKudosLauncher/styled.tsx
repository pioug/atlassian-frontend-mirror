import styled from 'styled-components';

export const SidebarContainer = styled.div`
  position: absolute;
  margin: 16px 0 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  > Button {
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    background: 0;
    border-radius: 50%;
    line-height: 1;
  }
`;
