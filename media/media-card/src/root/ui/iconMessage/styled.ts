import styled from 'styled-components';
import { keyframes } from 'styled-components';
import { N300 } from '@atlaskit/theme/colors';

export type StyledTextProps = {
  animated?: boolean;
  reducedFont?: boolean;
};

const breatheAnimation = keyframes`
 0% { opacity: 1}
 50% { opacity: 0.3 }
 100% { opacity: 1; }`;

const animatedStyles = `
  animation-name: ${breatheAnimation};
  animation-duration: 3.5s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
`;

export const IconMessageWrapper = styled.div`
  ${({ animated, reducedFont }: StyledTextProps) => `
    overflow: hidden;
    opacity: 1;
    font-weight: 450;
    ${reducedFont ? 'font-size: 0.7em;' : ''}
    color: ${N300};
    text-align:center;
    ${animated ? animatedStyles : ''}
    margin-bottom: -1em;
    padding: 3px 10px;
`}
`;

IconMessageWrapper.displayName = 'IconMessageWrapper';
