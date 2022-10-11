/** @jsx jsx */
import { useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import { ProgressIndicator } from '@atlaskit/progress-indicator';
import Textfield from '@atlaskit/textfield';

import FocusRing from '../src';

const stylesStyles = css({
  display: 'block',
  margin: '10px 0',
  padding: 8,
  border: 'none',
  borderRadius: '3px',
});

const stackStyles = css({
  display: 'flex',
  maxWidth: 200,
  padding: 8,
  gap: 8,
  flexDirection: 'column',
});

export default () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);

  const [index, setSelectedIndex] = useState(0);
  return (
    <div data-testid="outerDiv" css={stackStyles}>
      <Button>AK Button</Button>
      <FocusRing>
        <button type="button" ref={buttonRef} css={stylesStyles}>
          Native Button
        </button>
      </FocusRing>
      <Textfield placeholder="AK Textfield" />
      <FocusRing isInset>
        <input
          data-testid="input"
          css={stylesStyles}
          placeholder="Native Textfield"
        />
      </FocusRing>
      <ProgressIndicator
        values={[1, 2, 3, 4]}
        onSelect={({ index: selected }) => setSelectedIndex(selected)}
        selectedIndex={index}
        testId="focus-test"
      />
    </div>
  );
};
