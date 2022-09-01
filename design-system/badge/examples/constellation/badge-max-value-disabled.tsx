import React from 'react';

import Badge from '../../src';

const BadgeMaxValueDisabledExample = () => {
  return (
    <Badge appearance="added" max={false}>
      {1000}
    </Badge>
  );
};

export default BadgeMaxValueDisabledExample;
