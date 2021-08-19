/** @jsx jsx */

import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Badge from '@atlaskit/badge';
import Button from '@atlaskit/button/standard-button';
import * as colors from '@atlaskit/theme/colors';
import { fontSize } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

const labelStyles = css({
  display: 'inline-block',
  marginTop: `0`,
  marginBottom: '4px',
  color: token('color.text.lowEmphasis', colors.N200),
  fontSize: `${headingSizes.h200.size / fontSize()}em`,
  fontStyle: 'inherit',
  fontWeight: 600,
  lineHeight: headingSizes.h200.lineHeight / headingSizes.h200.size,
});

const blanketStyles = css({
  display: 'inline-flex',
  boxSizing: 'border-box',
  maxWidth: '144px',
  flexDirection: 'column',
  background: token('color.background.default', colors.N0),
  border: `2px dashed ${token('color.accent.subtleBlue', colors.B75)}`,
  pointerEvents: 'initial',
});

const behindOffsetStyles = css({
  marginLeft: '144px',
});

import Blanket from '../src';

const BasicExample = () => {
  const [isTinted, setIsTinted] = useState(false);
  const toggleIsTinted = useCallback(() => {
    setIsTinted((isTinted) => !isTinted);
  }, [setIsTinted]);

  const [shouldAllowClickThrough, setShouldAllowClickThrough] = useState(true);
  const toggleShouldAllowClickThrough = useCallback(() => {
    setShouldAllowClickThrough(
      (shouldAllowClickThrough) => !shouldAllowClickThrough,
    );
  }, [setShouldAllowClickThrough]);

  const [count, setCount] = useState(0);
  const incrementCount = useCallback(() => {
    setCount((count) => count + 1);
  }, [setCount]);

  return (
    <div>
      <Blanket
        isTinted={isTinted}
        shouldAllowClickThrough={shouldAllowClickThrough}
      >
        <div css={blanketStyles}>
          <h2>Blanket children</h2>
          <label css={labelStyles} htmlFor="is-tinted">
            Tint the blanket
          </label>
          <Toggle
            id="is-tinted"
            testId="is-tinted"
            onChange={toggleIsTinted}
            defaultChecked={isTinted}
          />
          <label css={labelStyles} htmlFor="allow-click-through">
            Allow click through
          </label>
          <Toggle
            id="allow-click-through"
            testId="allow-click-through"
            onChange={toggleShouldAllowClickThrough}
            defaultChecked={shouldAllowClickThrough}
          />
        </div>
      </Blanket>
      <div css={behindOffsetStyles}>
        <h2>Behind blanket</h2>
        <Button onClick={incrementCount} testId="increment">
          Increment
        </Button>
        <Badge testId="count">{count}</Badge>
      </div>
    </div>
  );
};

export default BasicExample;
