import React from 'react';
import Button from '@atlaskit/button';
import EmptyState from '../src';
import exampleImage from './img/example-image.png';

const primaryAction = (
  <Button
    appearance="primary"
    onClick={() => console.log('primary action clicked')}
  >
    Primary action
  </Button>
);

const tertiaryAction = (
  <Button
    appearance="subtle-link"
    href="http://www.example.com"
    target="_blank"
  >
    Tertiary action
  </Button>
);

const props = {
  header: 'I am the header',
  description: `Lorem ipsum is a pseudo-Latin text used in web design, 
        typography, layout, and printing in place of English to emphasise 
        design elements over content. It's also called placeholder (or filler) 
        text. It's a convenient tool for mock-ups.`,
  imageUrl: exampleImage,
  primaryAction,
  tertiaryAction,
  isLoading: true,
};

export default () => <EmptyState {...props} />;
