import styled from 'styled-components';

// We use !important to ensure next sibling gets the margin reset no matter what
export const ClearNextSiblingMarginTop = styled.div`
  & + * {
    margin-top: 0 !important;
  }
`;
