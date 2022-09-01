/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import { easeOut } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { useIsSidebarDragging } from '../../common/hooks';

const colorStops = `
    rgba(0, 0, 0, 0.2) 0px,
    rgba(0, 0, 0, 0.2) 1px,
    rgba(0, 0, 0, 0.1) 1px,
    rgba(0, 0, 0, 0) 100%
  `;
const direction = 'to left';
const transitionDuration = '0.22s';

const shadowStyles = css({
  width: 3,
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: -1,
  background: token(
    'color.border',
    `linear-gradient(${direction}, ${colorStops})`,
  ),
  opacity: 0.5,
  pointerEvents: 'none',
  transitionDuration: transitionDuration,
  transitionProperty: 'left, opacity, width',
  transitionTimingFunction: easeOut,
});

const draggingStyles = css({
  width: 6,
  left: -6,
  background: token(
    'color.background.neutral.subtle',
    `linear-gradient(${direction}, ${colorStops})`,
  ),
  opacity: 0.8,
});

const Shadow = ({ testId }: { testId?: string }) => {
  const isDragging = useIsSidebarDragging();

  return (
    <div
      data-testid={testId}
      css={[shadowStyles, isDragging && draggingStyles]}
    />
  );
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Shadow;
