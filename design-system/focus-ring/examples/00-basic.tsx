/** @jsx jsx */
import { useEffect, useRef } from 'react';

import { css, jsx } from '@emotion/core';

import FocusRing from '../src';

const stylesStyles = css({
  display: 'block',
  margin: '10px 0',
  padding: 8,
  border: 'none',
  borderRadius: '3px',
});

export default () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);
  return (
    <div data-testid="outerDiv" style={{ padding: 8 }}>
      <FocusRing>
        <button type="button" ref={buttonRef} css={stylesStyles}>
          hello
        </button>
      </FocusRing>
      <FocusRing isInset>
        <input data-testid="input" css={stylesStyles} placeholder="hello" />
      </FocusRing>
      <input css={stylesStyles} placeholder="standard input" />
    </div>
  );
};
