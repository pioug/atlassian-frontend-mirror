import styled from 'styled-components';

const StatelessSelectWrapper = styled.div`
  display: ${props => (props.shouldFitContainer ? 'block' : 'inline-block')};
`;

StatelessSelectWrapper.displayName = 'SingleSelectStatelessSelectWrapper';

export default StatelessSelectWrapper;
