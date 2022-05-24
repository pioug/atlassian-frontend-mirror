/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { TransformedToken } from 'style-dictionary';

import { token } from '../../../src';
import {
  getBorderForBackground,
  getBoxShadow,
  getTextColorForBackground,
} from '../../../src/utils/color-detection';

import CopyValueButton from './copy-button';

const baseStyles = css({
  fontSize: 14,
  outlineOffset: -1,
});
interface CopyButtonValueProps
  extends Pick<TransformedToken, 'value' | 'original' | 'attributes'> {
  className?: string;
}

const CopyButtonValue = ({
  value,
  original,
  attributes,
  className,
}: CopyButtonValueProps) => (
  <CopyValueButton
    copyValue={attributes?.group === 'shadow' ? undefined : original.value}
    css={[
      baseStyles,
      attributes?.group === 'shadow' && {
        backgroundColor: 'white',
        color: 'black',
        boxShadow: getBoxShadow(value),
        outline: `1px solid ${token('color.border', '#091E4224')}`,

        '&:hover, &:focus, &:active': {
          backgroundColor: 'white',
        },
      },
      (attributes?.group === 'paint' || attributes?.group === 'raw') && {
        backgroundColor: value,
        color: getTextColorForBackground(value),
        outline: getBorderForBackground(value),

        '&:hover, &:focus': {
          backgroundColor: value,
        },

        '&:active': {
          backgroundColor: value,
        },
      },
    ]}
    className={className}
  >
    {typeof value === 'string' && original.value}
  </CopyValueButton>
);

export default CopyButtonValue;
