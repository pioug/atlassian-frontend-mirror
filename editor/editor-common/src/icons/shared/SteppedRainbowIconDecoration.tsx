/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { N40, N60, N80, P300, R400, T300, Y400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const createSteppedRainbow = (colors: string[]) => {
  return `
    linear-gradient(
      to right,
      ${colors
        .map((color, i) => {
          const inc = 100 / colors.length;
          const pos = i + 1;

          if (i === 0) {
            return `${color} ${pos * inc}%,`;
          }

          if (i === colors.length - 1) {
            return `${color} ${(pos - 1) * inc}%`;
          }

          return `
            ${color} ${(pos - 1) * inc}%,
            ${color} ${pos * inc}%,
          `;
        })
        .join('\n')}
    )`;
};

const rainbow = createSteppedRainbow([P300, T300, Y400, R400]);
const disabledRainbow = createSteppedRainbow([N80, N60, N40, N60]);

const barStyles = css({
  position: 'absolute',
  left: 0,
  right: 0,
  top: token('space.200', '16px'),
  margin: 'auto',
  width: '12px',
  height: '3px',
  borderRadius: token('border.radius', '3px'),
});

const textColorIconWrapper = css({
  position: 'relative',
});

type SteppedRainbowIconDecorationProps = {
  selectedColor?: string | null;
  disabled?: boolean;
  icon: React.ReactNode;
};

const getBackground = (selectedColor?: string | null, disabled?: boolean) => {
  if (selectedColor) {
    return selectedColor;
  }
  if (disabled) {
    return disabledRainbow;
  }
  return rainbow;
};

export const SteppedRainbowIconDecoration = ({
  selectedColor,
  disabled,
  icon,
}: SteppedRainbowIconDecorationProps) => {
  return (
    <div css={textColorIconWrapper}>
      {icon}
      <div
        data-testid="toolbar-icon-stepped-rainbow"
        style={{ background: getBackground(selectedColor, disabled) }}
        css={barStyles}
      />
    </div>
  );
};
