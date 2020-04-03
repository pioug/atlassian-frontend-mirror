import React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { colors } from '@atlaskit/theme';
import EmptyState from '../src';
import exampleImage from './img/example-image.png';

const Container = styled.div`
  width: 300px;
  background-color: ${colors.N20};
`;

const primaryAction = (
  <Button
    appearance="primary"
    onClick={() => console.log('primary action clicked')}
  >
    Primary action
  </Button>
);

const secondaryAction = (
  <Button onClick={() => console.log('secondary action clicked')}>
    Secondary action
  </Button>
);

const tertiaryAction = (
  <Button appearance="subtle-link" href="#" target="_blank">
    Tertiary action
  </Button>
);

const props = {
  header: 'I am the header',
  imageUrl: exampleImage,
  imageHeight: 200,
  description: `Lorem ipsum is a pseudo-Latin text used in web design,
        typography, layout, and printing in place of English to emphasise
        design elements over content. It's also called placeholder (or filler)
        text. It's a convenient tool for mock-ups.`,
  primaryAction,
  secondaryAction,
  tertiaryAction,
};

export default () => (
  <Container>
    <EmptyState {...props} />
  </Container>
);
