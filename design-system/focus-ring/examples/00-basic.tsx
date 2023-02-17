/** @jsx jsx */
// This component has accessibility issues. Do not use without assistance from
// the Atlassian Design System accessibility team.
import { useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import { ProgressIndicator } from '@atlaskit/progress-indicator';
import SectionMessage from '@atlaskit/section-message';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import FocusRing from '../src';

const baseStyles = css({
  display: 'block',
  margin: '12px 0',
  padding: 8,
  border: 'none',
  borderRadius: '3px',
  font: 'inherit',
});

const stackStyles = css({
  display: 'flex',
  maxWidth: 300,
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
      <SectionMessage appearance="warning">
        This component has accessibility issues. Do not use without support from
        the Atlassian Design System accessibility team.
      </SectionMessage>
      <Button>AK Button</Button>
      <FocusRing>
        <button type="button" ref={buttonRef} css={baseStyles}>
          Native Button
        </button>
      </FocusRing>
      <Textfield placeholder="AK Textfield" />
      <FocusRing isInset>
        <input
          style={{
            border: `2px solid ${token('color.border', 'grey')}`,
          }}
          data-testid="input"
          css={baseStyles}
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
