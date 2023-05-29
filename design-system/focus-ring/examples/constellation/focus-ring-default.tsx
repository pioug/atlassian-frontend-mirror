/** @jsx jsx */
import { useEffect, useRef } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import FocusRing from '../../src';

const buttonStyles = css({
  display: 'block',
  margin: `${token('space.150', '12px')} 0`,
  padding: token('space.100', '8px'),
  border: 'none',
  borderRadius: token('border.radius.100', '3px'),
});

const spacerStyles = css({
  padding: token('space.100', '8px'),
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
