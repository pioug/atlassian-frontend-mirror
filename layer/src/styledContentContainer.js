import styled from 'styled-components';

export default styled.div`
  [data-role='droplistContent'] {
    ${({ maxHeight }) => (maxHeight ? `max-height: ${maxHeight}px` : '')};
  }
`;
