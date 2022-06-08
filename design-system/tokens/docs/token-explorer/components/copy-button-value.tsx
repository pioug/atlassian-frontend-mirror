/** @jsx jsx */
import { jsx } from '@emotion/core';
import { TransformedToken } from 'style-dictionary';

import { token } from '../../../src';
import {
  getBorderForBackground,
  getBoxShadow,
  getTextColorForBackground,
} from '../../../src/utils/color-detection';

import CopyButton from './copy-button';
import Highlight from './highlight';

interface CopyButtonValueProps
  extends Pick<TransformedToken, 'value' | 'original' | 'attributes'> {
  className?: string;
  searchQuery?: string;
}

const CopyButtonValue = ({
  value,
  original,
  attributes,
  className,
  searchQuery,
}: CopyButtonValueProps) => (
  <CopyButton
    copyValue={attributes?.group === 'shadow' ? undefined : original.value}
    css={[
      {
        outlineOffset: -1,
      },
      attributes?.group === 'shadow' && {
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
        backgroundColor: 'white',
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
        color: 'black',
        boxShadow: getBoxShadow(value),
        outline: `1px solid ${token('color.border', '#091E4224')}`,

        '&:hover, &:focus, &:active': {
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
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
      <Highlight highlight={searchQuery}>{original.value}</Highlight>
    )}
  </CopyButton>
);

export default CopyButtonValue;
