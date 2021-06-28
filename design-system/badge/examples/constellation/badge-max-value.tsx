import React from 'react';

import Badge from '../../src';

const BadgeMaxValueExample = () => {
  return (
    <Badge appearance="added" max={500}>
      {1000}
    </Badge>
  );
};

export default BadgeMaxValueExample;
