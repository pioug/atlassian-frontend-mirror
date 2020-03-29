import styled from 'styled-components';

interface StyledExpanderProps {
  isExpanded?: boolean;
}
export default styled.div<StyledExpanderProps>`
  max-height: ${({ isExpanded }: StyledExpanderProps) =>
    isExpanded ? 150 : 0}px;
  opacity: ${({ isExpanded }: StyledExpanderProps) => (isExpanded ? 1 : 0)};
  overflow: ${({ isExpanded }: StyledExpanderProps) =>
    isExpanded ? 'visible' : 'hidden'};
  transition: max-height 0.3s, opacity 0.3s;
`;
