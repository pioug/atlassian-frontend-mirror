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
  color: token('color.text', N800),
  lineHeight: '20px',
});

interface CommonCellProps {
  indent?: string;
  width?: string | number;
}

/**
 * __Common cell__
 */
const CommonCell: FC<HTMLAttributes<HTMLDivElement> & CommonCellProps> = ({
  indent,
  width,
  ...props
}) => (
  <div
    {...props}
    style={{ '--indent': indent, width } as CSSProperties}
    css={commonStyles}
  />
);

export default CommonCell;
