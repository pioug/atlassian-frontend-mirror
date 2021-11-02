import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';

import { DynamicTableStateless } from '../src';

import { head } from './content/sample-data';

const LoadingNoRowsExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
      <Button onClick={() => setIsLoading((loading) => !loading)}>
        Toggle loading
      </Button>
      <DynamicTableStateless head={head} isLoading={isLoading} />
    </div>
  );
};

export default LoadingNoRowsExample;
