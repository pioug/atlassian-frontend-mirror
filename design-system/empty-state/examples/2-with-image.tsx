import React from 'react';
import EmptyState from '../src';
import exampleImage from './img/example-image.png';

const props = {
  header: 'I am the header',
  imageUrl: exampleImage,
};

export default () => <EmptyState {...props} />;
