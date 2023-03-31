/* eslint-disable @repo/internal/react/consistent-css-prop-usage */
import React from 'react';

import { Box, xcss } from '../src';

// Example usage of the box xcss API
// generates a safe set of classNames
const safeStyles = xcss({
  transition: 'all 0.3s',
  ':hover': {
    transform: 'scale(2)',
  },
  // All of these will throw an error
  // '> *': {},
  // '[special-selector]': {},
  // '.class': {},
});

export default function Basic() {
  return (
    <Box
      xcss={safeStyles}
      width="size.500"
      height="size.500"
      backgroundColor="brand.bold"
      testId="box-basic"
      padding="space.100"
    />
  );
}
