/** @jsx jsx */
import { useEffect, useRef } from 'react';

import { jsx } from '@emotion/core';

import TextArea from '../src';

export default () => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    console.log('ref:', ref);
  }, [ref]);

  return (
    <div
      css={{
        maxWidth: 500,
      }}
    >
      <p>Basic:</p>
      <TextArea
        ref={ref}
        defaultValue="Lets play with ref !!"
        testId="refTestId"
      />
    </div>
  );
};
