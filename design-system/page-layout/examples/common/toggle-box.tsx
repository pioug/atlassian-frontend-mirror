/** @jsx jsx */

import type { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

type ToggleBoxProps = {
  children: ReactNode;
};

const toggleBoxStyles = css({
  padding: '1rem',
  position: 'fixed',
  zIndex: 1,
  bottom: '1rem',
  left: '50%',
  backgroundColor: token('color.background.neutral.subtle', 'white'),
  border: `1px solid ${token('color.border', 'lightgray')}`,
  borderRadius: 3,
  transform: 'translate(-50%)',
});

const ToggleBox = ({ children }: ToggleBoxProps) => {
  return <fieldset css={toggleBoxStyles}>{children}</fieldset>;
};

export default ToggleBox;
