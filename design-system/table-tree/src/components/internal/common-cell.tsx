/** @jsx jsx */
import { CSSProperties, FC, HTMLAttributes } from 'react';

import { css, jsx } from '@emotion/core';

import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const commonStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  minHeight: 40,
  padding: '10px 25px 10px var(--indent, 25px)',
  position: 'relative',
  alignItems: 'flex-start',
  color: token('color.text.highEmphasis', N800),
  lineHeight: '20px',
});

interface CommonCellProps {
  indent?: string;
}

/**
 * __Common cell__
 */
const CommonCell: FC<HTMLAttributes<HTMLDivElement> & CommonCellProps> = ({
  indent,
  ...props
}) => (
  <div
    style={{ '--indent': indent } as CSSProperties}
    css={commonStyles}
    {...props}
  />
);

export default CommonCell;
