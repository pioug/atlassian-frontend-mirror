import React from 'react';
import EmptyState, { Sizes } from '../src';
// @ts-ignore

import exampleImage from './img/example-image.svg';

const props = {
  header: 'I am the header',
  description: `Lorem ipsum is a pseudo-Latin text used in web design,
        typography, layout, and printing in place of English to emphasise
        design elements over content. It's also called placeholder (or filler)
        text. It's a convenient tool for mock-ups.`,
  imageUrl: exampleImage,
  size: 'narrow' as Sizes,
  maxImageWidth: 400,
  maxImageHeight: 400,
};

export default () => <EmptyState {...props} />;
