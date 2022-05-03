/** @jsx jsx */
import { Fragment } from 'react';

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

  '&:hover, &:focus': {
    '.copy-value__original': {
      display: 'none',
    },
    '.copy-value__value': {
      display: 'initial',
    },
  },
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
    copyValue={attributes?.group === 'shadow' ? getBoxShadow(value) : value}
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
    {typeof value === 'string' && (
      <Fragment>
        <span className="copy-value__original">{original.value}</span>
        <span className="copy-value__value" css={{ display: 'none' }}>
          {value}
        </span>
      </Fragment>
    )}
  </CopyValueButton>
);

export default CopyButtonValue;
