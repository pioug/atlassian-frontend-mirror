// TODO: remove this once ESLint rule has been fixed
/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Stack } from '@atlaskit/primitives';

import { token } from '../src';

const fonts = [
  'font.heading.xxl',
  'font.heading.xl',
  'font.heading.lg',
  'font.heading.md',
  'font.heading.sm',
  'font.heading.xs',
  'font.heading.xxs',
] as const;

const body = [
  'font.body.lg',
  'font.body',
  'font.body.sm',
  'font.ui',
  'font.ui.sm',
  'font.code',
] as const;

export default () => {
  return (
    <Box testId="typography">
      <Stack space="space.100">
        {fonts.map((f) => (
          <span key={f} style={{ font: token(f) }}>
            {f}
          </span>
        ))}
        {body.map((f) => (
          <span key={f} style={{ font: token(f) }}>
            {f}
          </span>
        ))}
      </Stack>
    </Box>
  );
};
