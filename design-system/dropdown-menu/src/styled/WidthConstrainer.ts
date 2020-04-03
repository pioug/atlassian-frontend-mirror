import styled from 'styled-components';

export default styled.div<{ shouldFitContainer: boolean }>`
  ${({ shouldFitContainer }) =>
    shouldFitContainer ? '' : 'max-width: 300px;'};
`;
