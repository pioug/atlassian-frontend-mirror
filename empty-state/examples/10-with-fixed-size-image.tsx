import React from 'react';
import EmptyState from '../src';
import exampleImage from './img/example-image.png';

const props = {
  header: 'I am the header',
  imageUrl: exampleImage,
  imageWidth: 200,
  imageHeight: 200,
};

export default () => <EmptyState {...props} />;
