import React, { useState } from 'react';

import Button from '@atlaskit/button/new';

import { DynamicTableStateless } from '../src';

import { head, rows } from './content/sample-data';

const LoadingPartialPageExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
      <Button onClick={() => setIsLoading((loading) => !loading)}>
        Toggle loading
      </Button>
      <DynamicTableStateless
        head={head}
        rows={rows}
        rowsPerPage={5}
        page={1}
        isLoading={isLoading}
      />
    </div>
  );
};

export default LoadingPartialPageExample;
