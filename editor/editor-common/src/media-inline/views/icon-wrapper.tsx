/** @jsx jsx */
import { css, jsx } from '@emotion/react';

type Props = {
  children?: React.ReactNode;
};

const wrapperStyle = css({
  display: 'flex',
  'span > svg': { verticalAlign: 'top' },
});

export const IconWrapper = ({ children }: React.PropsWithChildren<Props>) => {
  return (
    <span css={wrapperStyle} data-testid="media-inline-image-card-icon">
      {children}
    </span>
  );
};
