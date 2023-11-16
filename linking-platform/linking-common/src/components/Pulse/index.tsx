/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const pulseKeyframes = keyframes`
to {
  box-shadow: 0 0 0 7px rgba(0, 0, 0, 0);
}
`;

const pulseStyles = css`
  border-radius: 3px;
  box-shadow: 0 0 0 0 ${token('color.background.discovery.bold', '#5243AA')};
  animation: ${pulseKeyframes} 1.45s cubic-bezier(0.5, 0, 0, 1) 3;
`;

const commonStyles = css`
  display: inline;
`;

export interface PulseProps {
  children: JSX.Element;
  isDiscovered?: boolean;
  onAnimationIteration?: React.AnimationEventHandler<HTMLSpanElement>;
  onAnimationStart?: React.AnimationEventHandler<HTMLSpanElement>;
}

export const Pulse = ({
  children,
  isDiscovered = false,
  onAnimationIteration,
  onAnimationStart,
}: PulseProps) => {
  return (
    <div
      data-testid="discovery-pulse"
      css={[commonStyles, !isDiscovered && pulseStyles]}
      onAnimationIteration={onAnimationIteration}
      onAnimationStart={onAnimationStart}
    >
      {children}
    </div>
  );
};

export default Pulse;
