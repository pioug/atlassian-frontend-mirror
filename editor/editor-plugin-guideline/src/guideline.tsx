/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { GuidelinePosition } from './types';

const BasicGuidelineStyles = css({
  borderLeft: `1px solid ${token('color.border', N30A)}`,
  position: 'absolute',
  width: '1px',
  height: '100%',
  zIndex: 0,
  transition: 'border-color 0.15s linear',
});

type Props = {
  position: GuidelinePosition;
};

const positionToStyle = (position: GuidelinePosition): React.CSSProperties => {
  const { left, right } = position;
  return left ? { left } : { right };
};

export const Guideline = (props: Props) => (
  <div css={BasicGuidelineStyles} style={positionToStyle(props.position)} />
);
