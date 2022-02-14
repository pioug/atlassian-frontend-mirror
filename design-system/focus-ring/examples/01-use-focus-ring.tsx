/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button';
import VisuallyHidden from '@atlaskit/visually-hidden';

import FocusRing, { useFocusRing } from '../src';

const stackStyles = css({
  display: 'flex',
  maxWidth: 200,
  padding: 8,
  gap: 16,
  flexDirection: 'column',
});

const standardStyles = {
  textAlign: 'center',
  borderRadius: 3,
  borderColor: 'transparent',
} as const;

export default () => {
  const { focusProps, focusState } = useFocusRing();
  return (
    <div data-testid="outerDiv" css={stackStyles}>
      <Button>AK Button</Button>
      <FocusRing focus={focusState}>
        <div style={standardStyles}>Synthetically Receives Visual Focus</div>
      </FocusRing>
      <VisuallyHidden>
        <input {...focusProps} />
      </VisuallyHidden>
      <FocusRing>
        <button style={standardStyles} type="button">
          Native Button
        </button>
      </FocusRing>
    </div>
  );
};
