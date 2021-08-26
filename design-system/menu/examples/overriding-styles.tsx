/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import RightArrow from '@atlaskit/icon/glyph/arrow-right';

import { ButtonItem } from '../src';

import koala from './icons/koala.png';

const ImgIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img alt={alt} src={src} height={24} width={24} style={{ borderRadius: 3 }} />
);

export default () => (
  <React.Fragment>
    <ButtonItem
      onClick={console.log}
      iconBefore={<ImgIcon src={koala} alt={'Koala'} />}
      description="Hover over me"
      iconAfter={<RightArrow label="" />}
      isSelected
      // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
      cssFn={({ isSelected }) => {
        return {
          padding: '12px 20px',
          border: '1px solid #CDCDCD',
          backgroundColor: 'aliceblue',
          borderRadius: 3,
          '&:hover': {
            backgroundColor: 'antiquewhite',
          },
          ['& [data-item-description]']: {
            fontStyle: 'italic',
            ...(isSelected && { textDecoration: 'underline' }),
          },
          ['& [data-item-elem-before]']: { filter: 'grayscale(1)' },
          ['& [data-item-elem-after]']: { opacity: 0 },
          ['&:hover [data-item-elem-after]']: { opacity: 1 },
        };
      }}
    >
      Nested navigation item
    </ButtonItem>
    <ButtonItem
      onClick={console.log}
      iconBefore={<ImgIcon alt="" src={koala} />}
      description="Hover over me"
      iconAfter={<RightArrow label="" />}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
      cssFn={() => ({
        color: 'red',
        '&:hover': {
          color: 'green',
          '[data-item-description]': {
            color: 'green',
          },
        },
        '& [data-item-description]': {
          color: 'red',
        },
      })}
    >
      Nested navigation item with cssFn override
    </ButtonItem>
  </React.Fragment>
);
