import React from 'react';

import { Box, xcss } from '../src';

// this example is not useful for its visual result but instead to record
// typing decisions to the interface of `xcss` that we expect to maintain

const onlyTokenisedStyles = xcss({
  backgroundColor: 'color.background.brand.bold',
  width: 'size.500',
  height: 'size.500',
  padding: 'space.100',
  paddingInlineStart: 'space.100',
  paddingRight: 'space.100',
  margin: 'space.100',
  marginInlineStart: 'space.100',
  marginLeft: 'space.200',
  marginRight: 'space.100',
});

const rawValuesStyles = xcss({
  // properties we enforce tokens
  // @ts-expect-error
  backgroundColor: 'purple',
  // @ts-expect-error
  padding: '8px',
  // @ts-expect-error
  paddingInlineStart: '8px',

  // things that can also be raw values (any string...)
  width: '100px',
  height: '100px',
  paddingRight: '8px',
  margin: '8px',
  marginInlineStart: '8px',
  marginLeft: 'auto',
  marginRight: '8px',
});

export default function Basic() {
  return (
    <Box testId="box-xcss" xcss={[onlyTokenisedStyles, rawValuesStyles]} />
  );
}
