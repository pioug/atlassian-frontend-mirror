/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const actionsStyles = css({
  display: 'flex',
  marginBottom: token('space.100', '8px'),
  paddingLeft: token('space.500', '40px'),
  alignItems: 'center',
  justifyContent: 'center',
});

/**
 * __Actions container__
 *
 * A container for actions: primary action, secondary action, and tertiary action.
 *
 * @internal
 */
const ActionsContainer: FC<{ children: ReactNode }> = ({ children }) => (
  <div css={actionsStyles}>{children}</div>
);

export default ActionsContainer;
