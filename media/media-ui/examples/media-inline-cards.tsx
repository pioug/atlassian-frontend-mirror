import React from 'react';
import { Container } from '../example-helpers/styled';

import {
  MediaInlineCardErroredView,
  MediaInlineCardLoadedView,
  MediaInlineCardLoadingView,
} from '../src';

export default () => (
  <div
    style={{
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}
  >
    <Container
      style={{
        gap: '1rem',
      }}
    >
      isSelected = false
      <MediaInlineCardLoadingView message="I'm loading" />
      <MediaInlineCardLoadedView title="I'm loaded 💰" />
      <MediaInlineCardErroredView message="Ups! an error" />
    </Container>
    <Container
      style={{
        gap: '1rem',
      }}
    >
      isSelected = true
      <MediaInlineCardLoadingView message="I'm loading" isSelected />
      <MediaInlineCardLoadedView title="I'm loaded 💰" isSelected />
      <MediaInlineCardErroredView message="Ups! an error" isSelected />
    </Container>
  </div>
);
