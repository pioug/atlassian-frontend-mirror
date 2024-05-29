/** @jsx jsx */
import type { CSSProperties, FC, HTMLAttributes, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { indentBase } from './styled';

const commonStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  minHeight: 40,
  padding: `${token('space.100', '10px')} ${indentBase} ${token(
    'space.100',
    '10px',
  )} var(--indent, ${indentBase})`,
  position: 'relative',
  alignItems: 'center',
  color: token('color.text', N800),
  hyphens: 'auto',
  lineHeight: token('font.lineHeight.200', '20px'),
  wordBreak: 'break-word',
});

interface CommonCellProps {
  indent?: string;
  width?: string | number;
  children?: ReactNode;
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
    role="gridcell"
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    {...props}
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
    style={{ '--indent': indent, width } as CSSProperties}
    css={commonStyles}
  />
);

export default CommonCell;
