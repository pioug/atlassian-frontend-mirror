import styled from 'styled-components';
import { resizeAnimationTime } from '../../shared-variables';

const SpacerInner = styled.div`
  transition: ${({ shouldAnimate }) =>
    shouldAnimate ? `width ${resizeAnimationTime}` : 'none'};
`;

SpacerInner.displayName = 'SpacerInner';
export default SpacerInner;
