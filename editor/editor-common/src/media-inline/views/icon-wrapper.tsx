/** @jsx jsx */
import type { FC } from 'react';

import { css, jsx } from '@emotion/react';

type Props = {
  children?: React.ReactNode;
};

const wrapperStyle = css({
  display: 'flex',
  'span > svg': { verticalAlign: 'top' },
});

export const IconWrapper: FC<Props> = ({ children }) => {
  return (
    <span css={wrapperStyle} data-testid="media-inline-image-card-icon">
      {children}
    </span>
  );
};
