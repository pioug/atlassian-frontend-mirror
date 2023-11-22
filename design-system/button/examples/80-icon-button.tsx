import React from 'react';

import StarIcon from '@atlaskit/icon/glyph/star';
import Inline from '@atlaskit/primitives/inline';
import Stack from '@atlaskit/primitives/stack';

import IconButton from '../src/new-button/variants/icon/button';

export default function IconButtonExample() {
  return (
    <Stack space="space.100">
      <h2>Spacing</h2>
      <Inline space="space.100">
        <IconButton
          label="Add to favorites"
          icon={StarIcon}
          spacing="compact"
        />
        <IconButton
          label="Add to favorites"
          icon={StarIcon}
          spacing="default"
        />
      </Inline>
      <h2>Sizing</h2>
      <Inline space="space.100">
        <IconButton
          label="Add to favorites"
          icon={StarIcon}
          UNSAFE_size="small"
        />
        <IconButton label="Add to favorites" icon={StarIcon} />
        <IconButton
          label="Add to favorites"
          icon={StarIcon}
          UNSAFE_size="large"
        />
      </Inline>
      <h2>Appearances</h2>
      <Inline space="space.100" grow="hug">
        <IconButton label="Add to favorites" icon={StarIcon} />
        <IconButton
          label="Add to favorites"
          appearance="primary"
          icon={StarIcon}
        />
        <IconButton
          label="Add to favorites"
          appearance="subtle"
          icon={StarIcon}
        />
      </Inline>
      <h2>Appearances - DISABLED</h2>
      <Inline space="space.100" grow="hug">
        <IconButton label="Add to favorites" isDisabled icon={StarIcon} />
        <IconButton
          label="Add to favorites"
          isDisabled
          appearance="primary"
          icon={StarIcon}
        />
        <IconButton
          label="Add to favorites"
          isDisabled
          appearance="subtle"
          icon={StarIcon}
        />
      </Inline>
    </Stack>
  );
}
