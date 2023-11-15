import React from 'react';

import StarIcon from '@atlaskit/icon/glyph/star';
import { Inline, Stack } from '@atlaskit/primitives';

import IconButton from '../src/new-button/variants/icon/button';

export default function IconButtonAppearanceExample() {
  return (
    <Stack>
      All appearances
      <Inline space="space.100" grow="hug">
        <IconButton icon={<StarIcon label="" />}>Star</IconButton>
        <IconButton appearance="primary" icon={<StarIcon label="" />}>
          Star
        </IconButton>
        <IconButton appearance="warning" icon={<StarIcon label="" />}>
          Star
        </IconButton>
        <IconButton appearance="danger" icon={<StarIcon label="" />}>
          Star
        </IconButton>
        <IconButton appearance="subtle" icon={<StarIcon label="" />}>
          Star
        </IconButton>
      </Inline>
      All appearances - DISABLED
      <Inline space="space.100" grow="hug">
        <IconButton isDisabled icon={<StarIcon label="" />}>
          Star
        </IconButton>
        <IconButton
          isDisabled
          appearance="primary"
          icon={<StarIcon label="" />}
        >
          Star
        </IconButton>
        <IconButton
          isDisabled
          appearance="warning"
          icon={<StarIcon label="" />}
        >
          Star
        </IconButton>
        <IconButton isDisabled appearance="danger" icon={<StarIcon label="" />}>
          Star
        </IconButton>
        <IconButton isDisabled appearance="subtle" icon={<StarIcon label="" />}>
          Star
        </IconButton>
      </Inline>
    </Stack>
  );
}
