/** @jsx jsx */
import { jsx } from '@emotion/react';

import { token } from '../../../src';
import {
  getBorderForBackground,
  getBoxShadow,
  getTextColorForBackground,
} from '../../../src/utils/color-detection';
import type { TransformedTokenMerged } from '../types';

import CopyButton from './copy-button';

interface CopyButtonValueProps
  extends Pick<TransformedTokenMerged, 'value' | 'original' | 'attributes'> {
  className?: string;
}

const CopyButtonValue = ({
  value,
  original,
  attributes,
  className,
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
    {typeof value === 'string' && original.value}
  </CopyButton>
);

export default CopyButtonValue;
