import styled from 'styled-components';

const SkeletonIconWrapper = styled.div`
  display: flex; /* to fix "baseline space below inline-block element problem" https://stackoverflow.com/q/17905827/1343917 */
  flex-shrink: 0; /* so that too big width of header text does not change width of avatar */
`;

SkeletonIconWrapper.displayName = 'SkeletonIconWrapper';
export default SkeletonIconWrapper;
