/** @jsx jsx */
import { css, jsx } from '@emotion/react';

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

const opacityStyles = css({
  position: 'relative',
  zIndex: 0,
  backgroundColor: token('elevation.surface', '#ffffff'),
  backgroundImage: `linear-gradient(
          45deg,
          ${token('elevation.surface.sunken', '#F4F5F7')} 25%,
          transparent 25%
        ),
        linear-gradient(
          135deg,
          ${token('elevation.surface.sunken', '#F4F5F7')} 25%,
          transparent 25%
        ),
        linear-gradient(
          45deg,
          transparent 75%,
          ${token('elevation.surface.sunken', '#F4F5F7')} 75%
        ),
        linear-gradient(
          135deg,
          transparent 75%,
          ${token('elevation.surface.sunken', '#F4F5F7')} 75%
        )`,
  backgroundPosition: '0px 0px, 8px 0px, 8px -8px, 0px 8px',
  backgroundSize: '16px 16px',
  color: token('color.text', 'black'),
  overflow: 'hidden',
});

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
      attributes?.group === 'opacity' && opacityStyles,
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
    {(typeof value === 'string' || typeof value === 'number') && original.value}
    {attributes.group === 'opacity' && (
      <span
        css={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: value,
          backgroundColor: token('color.text', 'black'),
        }}
      />
    )}
  </CopyButton>
);

export default CopyButtonValue;
