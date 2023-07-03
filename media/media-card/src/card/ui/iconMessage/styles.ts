import { token } from '@atlaskit/tokens';
import { css, keyframes } from '@emotion/react';
import { N300 } from '@atlaskit/theme/colors';

import { StyledTextProps } from './types';

const breatheAnimation = keyframes`
 0% { opacity: 1}
 50% { opacity: 0.3 }
 100% { opacity: 1; }`;

const animatedStyles = css`
  animation-name: ${breatheAnimation};
  animation-duration: 3.5s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
`;

const getStylesBasedOnProps = ({
  animated,
  reducedFont,
}: // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
StyledTextProps) => css`
  overflow: hidden;
  opacity: 1;
  font-weight: 450;
  ${reducedFont ? 'font-size: 0.7em;' : ''}
  color: ${token('color.text.subtlest', N300)};
  text-align: center;
  ${animated ? animatedStyles : ''}
  margin-bottom: -1em;
  padding: 3px 10px;
`;

export const iconMessageWrapperStyles = (props: StyledTextProps) => css`
  ${getStylesBasedOnProps(props)}
`;

iconMessageWrapperStyles.displayName = 'IconMessageWrapper';
