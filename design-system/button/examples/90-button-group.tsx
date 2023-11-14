import React from 'react';

import capitalize from 'lodash/capitalize';

import AudioIcon from '@atlaskit/icon/glyph/audio';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import { ButtonGroup } from '../src';
import Button from '../src/new-button/variants/default/button';
import appearances from '../src/utils/appearances';
import spacing from '../src/utils/spacing';
import variants from '../src/utils/variants';

const constrainedRowStyles = xcss({
  width: 'size.1000',
  overflowX: 'scroll',
});

const ConstrainedRow = (props: { children: React.ReactNode }) => (
  <Box xcss={constrainedRowStyles}>{props.children}</Box>
);

export default function ButtonGroupExample() {
  return (
    <Stack alignInline="start" space="space.100">
      {variants.map(({ name, Component }) => (
        <Stack key={name} space="space.150">
          <h2>{name}</h2>
          {spacing.map((space) => (
            <Stack key={space} space="space.100">
              <h3>{capitalize(space)} spacing</h3>
              <Stack space="space.100">
                <ButtonGroup>
                  <Component spacing={space}>First Button</Component>
                  <Component spacing={space}>Second Button</Component>
                  <Component spacing={space}>Third Button</Component>
                </ButtonGroup>
              </Stack>
            </Stack>
          ))}
          <h2>Shared appearances</h2>
          {appearances.map((appearance) => (
            <Stack key={appearance} space="space.100">
              <h3>{capitalize(appearance)}</h3>
              <Stack space="space.100">
                <ButtonGroup appearance={appearance}>
                  <Component>First Button</Component>
                  <Component>Second Button</Component>
                  <Component>Third Button</Component>
                </ButtonGroup>
              </Stack>
            </Stack>
          ))}
        </Stack>
      ))}
      <h2>Scrolling overflow</h2>
      <ConstrainedRow>
        <ButtonGroup>
          <Button>Good times</Button>
          <Button iconAfter={<AudioIcon label="" />}>Boogie</Button>
          <Button iconAfter={<AudioIcon label="" />}>Boogie more</Button>
        </ButtonGroup>
      </ConstrainedRow>
    </Stack>
  );
}
