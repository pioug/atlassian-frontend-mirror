/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { isVerticalPosition } from '@atlaskit/editor-common/guideline';
import { B200, N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { getPositionStyles } from './positionStyles';
import { GuidelineConfig } from './types';

const basicGuidelineStyles = css({
  position: 'absolute',
  zIndex: 0,
  opacity: 1,
  transition: 'border-color 0.15s linear, opacity 0.15s linear',
  borderColor: `${token('color.border.disabled', N30A)}`,
  borderStyle: 'solid',
});

const verticalStyles = css({
  borderWidth: `0 0 0 1px`,
  width: '1px',
  height: '100%',
});

const horizontalStyles = css({
  borderWidth: `1px 0 0 0`,
  width: '100%',
  height: '1px',
});

const activeGuidelineStyles = css({
  borderColor: token('color.border.focused', B200),
  '&:before, &:after': {
    backgroundColor: token('color.border.focused', B200),
  },
});

const hiddenGuidelineStyles = css({
  opacity: 0,
});

const dashedGuidelineStyles = css({
  borderLeftStyle: 'dashed',
});

const verticalCapStyles = css({
  '&:before, &:after': {
    backgroundColor: token('color.border.disabled', N30A),
    content: '""',
    position: 'absolute',
    height: '10px',
    width: '1px',
    transform: 'translateY(-50%)',
  },
  '&:after': {
    right: 0,
  },
});

const horizontalCapStyles = css({
  '&:before, &:after': {
    backgroundColor: `${token('color.border.disabled', N30A)}`,
    content: '""',
    position: 'absolute',
    height: '1px',
    width: '10px',
    transform: 'translateX(-50%)',
  },
  '&:after': {
    bottom: 0,
  },
});

export const Guideline = (props: Omit<GuidelineConfig, 'key'>) => {
  const { position, active, show = true, styles = {} } = props;
  const isVerticalPos = isVerticalPosition(position);

  const { lineStyle, color, capStyle } = styles;

  return (
    <div
      css={[
        basicGuidelineStyles,
        isVerticalPos ? verticalStyles : horizontalStyles,
        capStyle === 'line' &&
          (isVerticalPos ? horizontalCapStyles : verticalCapStyles),
        active && activeGuidelineStyles,
        !show && hiddenGuidelineStyles,
        lineStyle === 'dashed' && dashedGuidelineStyles,
      ]}
      style={{
        ...(color && { borderColor: `${color}` }),
        ...getPositionStyles(position),
      }}
      className="guideline"
    />
  );
};
