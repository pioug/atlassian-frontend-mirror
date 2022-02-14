/** @jsx jsx */

import { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { cssVar } from '../../../constants';

interface BeforeProps {
  elemBefore?: ReactNode;
}

const beforeElementStyles = css({
  display: 'flex',
  position: 'absolute',
  left: 0,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: `var(${cssVar.borderRadius})`,
  color: `var(${cssVar.color.text.default})`,
});

const Before = ({ elemBefore }: BeforeProps) =>
  elemBefore ? <span css={beforeElementStyles}>{elemBefore}</span> : null;

export default Before;
