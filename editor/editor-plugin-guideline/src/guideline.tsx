/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { B200, N30A } from '@atlaskit/theme/colors';
import { CSSToken, token } from '@atlaskit/tokens';

const BasicGuidelineStyles = css({
  borderLeft: `1px solid ${token('color.border', N30A)}`,
  position: 'absolute',
  width: '1px',
  height: '100%',
  zIndex: 0,
  transform: 'translateX(-50%)',
  opacity: 1,
  transition: 'border-color 0.15s linear, opacity 0.15s linear',
});

const ActiveGuidelineStyles = css({
  borderColor: token('color.border.focused', B200),
});

const HiddenGuidelineStyles = css({
  opacity: 0,
});

const DashedGuidelineStyles = css({
  borderLeftStyle: 'dashed',
});

type Props = {
  position: number;
  active?: boolean;
  show?: boolean;
  style?: 'dashed' | 'solid'; // default solid
  color?: CSSToken;
};

export const Guideline = (props: Props) => {
  const { position, active, show = true, style, color } = props;

  return (
    <div
      css={[
        BasicGuidelineStyles,
        active && ActiveGuidelineStyles,
        !show && HiddenGuidelineStyles,
        style === 'dashed' && DashedGuidelineStyles,
      ]}
      className="guideline"
      style={{
        left: `${position}px`,
        ...(color && { borderColor: `${color}` }),
      }}
    />
  );
};
