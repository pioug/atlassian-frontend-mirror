import React from 'react';
import { Container } from '../example-helpers/styled';

import {
  MediaInlineCardErroredView,
  MediaInlineCardLoadedView,
  MediaInlineCardLoadingView,
} from '../src';

import { token } from '@atlaskit/tokens';

export default () => (
  <div
    style={{
      padding: token('space.400', '2rem'),
      display: 'flex',
      flexDirection: 'column',
      gap: token('space.200', '1rem'),
    }}
  >
    <Container
      style={{
        gap: token('space.200', '1rem'),
      }}
    >
      <MediaInlineCardLoadingView message="I'm loading" />
      <MediaInlineCardLoadedView title="I'm loaded" />
      <MediaInlineCardErroredView message="Ups! an error" />
    </Container>
    <Container
      style={{
        gap: token('space.200', '1rem'),
      }}
    >
      <MediaInlineCardLoadingView message="I'm loading" isSelected />
      <MediaInlineCardLoadedView title="I'm loaded" isSelected />
      <MediaInlineCardErroredView message="Ups! an error" isSelected />
    </Container>
  </div>
);
