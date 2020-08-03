import React from 'react';

import Badge from '../../src';

export default function Example() {
  return (
    <Badge appearance="added" max={500}>
      {1000}
    </Badge>
  );
}
