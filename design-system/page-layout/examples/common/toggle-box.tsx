/** @jsx jsx */

import type { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

type ToggleBoxProps = {
  children: ReactNode;
};

const toggleBoxStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  padding: '1rem',
  position: 'fixed',
  zIndex: 1,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  bottom: '1rem',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  left: '50%',
  backgroundColor: token('color.background.neutral.subtle', 'white'),
  border: `1px solid ${token('color.border', 'lightgray')}`,
  borderRadius: token('border.radius', '3px'),
  transform: 'translate(-50%)',
});

const ToggleBox = ({ children }: ToggleBoxProps) => {
  return <fieldset css={toggleBoxStyles}>{children}</fieldset>;
};

export default ToggleBox;
