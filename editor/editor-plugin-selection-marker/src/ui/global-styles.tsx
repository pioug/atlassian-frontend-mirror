/** @jsx jsx */
import { css, Global, jsx } from '@emotion/react';

// Unset the selection background color as we are using our own
// Otherwise we might have a mix of grey + our selection marker depending on the state.
const globalStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '.ProseMirror:not(:focus) ::selection': {
    background: 'unset',
  },
});

export const GlobalStylesWrapper = () => {
  return <Global styles={globalStyles} />;
};
