// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

import Badge from '../src';

export default () => {
  return (
    <Badge appearance="added" max={99}>
      {3000}
    </Badge>
  );
};
