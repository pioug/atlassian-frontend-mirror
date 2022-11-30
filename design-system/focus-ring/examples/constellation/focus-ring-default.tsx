/** @jsx jsx */
import { useEffect, useRef } from 'react';

import { css, jsx } from '@emotion/react';

import FocusRing from '../../src';

const buttonStyles = css({
  display: 'block',
  margin: '12px 0',
  padding: 8,
  border: 'none',
  borderRadius: '3px',
});

const spacerStyles = css({
  padding: 8,
});

export default () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);

  return (
    <div css={spacerStyles}>
      <FocusRing>
        <button type="button" ref={buttonRef} css={buttonStyles}>
          Native Button
        </button>
      </FocusRing>
    </div>
  );
};
