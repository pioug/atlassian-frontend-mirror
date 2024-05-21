/** @jsx jsx */
import { type ComponentType } from 'react';
import { type SerializedStyles, css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import {
  type IconTileProps,
  type IconTileSize,
  type IconTileAppearance,
} from '../types';
import { type InternalIconPropsNew } from './icon-new';

const sizeMap: { [K in IconTileSize]: SerializedStyles } = {
  '16': css({
    width: '16px',
    height: '16px',
  }),
  '24': css({
    width: '24px',
    height: '24px',
  }),
  '32': css({
    width: '32px',
    height: '32px',
  }),
  '40': css({
    width: '40px',
    height: '40px',
  }),
  '48': css({
    width: '48px',
    height: '48px',
  }),
};

const appearanceMap: { [K in IconTileAppearance]: SerializedStyles } = {
  grayBold: css({
    backgroundColor: token('color.background.accent.gray.bolder'),
    color: token('color.icon.inverse'),
  }),
  limeBold: css({
    backgroundColor: token('color.background.accent.lime.bolder'),
    color: token('color.icon.inverse'),
  }),
  greenBold: css({
    backgroundColor: token('color.background.accent.green.bolder'),
    color: token('color.icon.inverse'),
  }),
  blueBold: css({
    backgroundColor: token('color.background.accent.blue.bolder'),
    color: token('color.icon.inverse'),
  }),
  redBold: css({
    backgroundColor: token('color.background.accent.red.bolder'),
    color: token('color.icon.inverse'),
  }),
  purpleBold: css({
    backgroundColor: token('color.background.accent.purple.bolder'),
    color: token('color.icon.inverse'),
  }),
  magentaBold: css({
    backgroundColor: token('color.background.accent.magenta.bolder'),
    color: token('color.icon.inverse'),
  }),
  tealBold: css({
    backgroundColor: token('color.background.accent.teal.bolder'),
    color: token('color.icon.inverse'),
  }),
  orangeBold: css({
    backgroundColor: token('color.background.accent.orange.bolder'),
    color: token('color.icon.inverse'),
  }),
  yellowBold: css({
    backgroundColor: token('color.background.accent.yellow.bolder'),
    color: token('color.icon.inverse'),
  }),
  gray: css({
    backgroundColor: token('color.background.accent.gray.subtler'),
    color: token('color.icon.accent.gray'),
  }),
  lime: css({
    backgroundColor: token('color.background.accent.lime.subtler'),
    color: token('color.icon.accent.lime'),
  }),
  orange: css({
    backgroundColor: token('color.background.accent.orange.subtler'),
    color: token('color.icon.accent.orange'),
  }),
  magenta: css({
    backgroundColor: token('color.background.accent.magenta.subtler'),
    color: token('color.icon.accent.magenta'),
  }),
  green: css({
    backgroundColor: token('color.background.accent.green.subtler'),
    color: token('color.icon.accent.green'),
  }),
  blue: css({
    backgroundColor: token('color.background.accent.blue.subtler'),
    color: token('color.icon.accent.blue'),
  }),
  red: css({
    backgroundColor: token('color.background.accent.red.subtler'),
    color: token('color.icon.accent.red'),
  }),
  purple: css({
    backgroundColor: token('color.background.accent.purple.subtler'),
    color: token('color.icon.accent.purple'),
  }),
  teal: css({
    backgroundColor: token('color.background.accent.teal.subtler'),
    color: token('color.icon.accent.teal'),
  }),
  yellow: css({
    backgroundColor: token('color.background.accent.yellow.subtler'),
    color: token('color.icon.accent.yellow'),
  }),
};

const shapeMap = {
  square: css({
    borderRadius: token('border.radius.100'),
  }),
  circle: css({
    borderRadius: token('border.radius.circle'),
  }),
};

const iconTileStyles = css({
  display: 'inline-flex',
  boxSizing: 'border-box',
  alignItems: 'center',
  justifyContent: 'center',
});

/**
 * __IconTile__ -- ⚠️ Experimental ⚠️
 *
 * An icon tile is used to present an icon with a background color.
 * Icon tiles, unlike standard icons, can scale up and down to provide greater emphasis.
 *
 * This component is currently in an experimental state and is subject to change in minor or patch releases.
 *
 */
export default function IconTile(props: IconTileProps) {
  const {
    icon: Icon,
    label,
    appearance,
    size = '24',
    shape = 'square',
  } = props;

  const ExpandedIcon = Icon as ComponentType<InternalIconPropsNew>;
  return (
    <span
      css={[
        iconTileStyles,
        appearanceMap[appearance],
        sizeMap[size],
        shapeMap[shape],
      ]}
    >
      <ExpandedIcon
        color="currentColor"
        label={label}
        spacing="spacious"
        shouldScale={true}
      />
    </span>
  );
}
