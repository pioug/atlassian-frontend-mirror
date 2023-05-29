/** @jsx jsx */

import type { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

type ToggleBoxProps = {
  children: ReactNode;
};

const toggleBoxStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  padding: '1rem',
  position: 'fixed',
  zIndex: 1,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  bottom: '1rem',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
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
