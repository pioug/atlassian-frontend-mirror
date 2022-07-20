/**@jsx jsx */
import { jsx } from '@emotion/react';

import { blanketStyles, blanketClassName } from './styles';

export interface BlanketProps {
  isFixed?: boolean;
}

export const Blanket = (props: BlanketProps) => {
  const { isFixed } = props;

  return <div css={blanketStyles(isFixed)} className={blanketClassName} />;
};
