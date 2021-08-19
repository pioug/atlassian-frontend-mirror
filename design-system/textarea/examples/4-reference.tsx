/** @jsx jsx */
import { useEffect, useRef } from 'react';

import { css, jsx } from '@emotion/core';

import TextArea from '../src';

const wrapperStyles = css({
  maxWidth: 500,
});

export default () => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    console.log('ref:', ref);
  }, [ref]);

  return (
    <div css={wrapperStyles}>
      <p>Basic:</p>
      <TextArea
        ref={ref}
        defaultValue="Lets play with ref !!"
        testId="refTestId"
      />
    </div>
  );
};
