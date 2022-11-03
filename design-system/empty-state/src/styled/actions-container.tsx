/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const actionsStyles = css({
  display: 'flex',
  // TODO Delete this comment after verifying spacing token -> previous value ``${gridSize}px``
  marginBottom: token('spacing.scale.100', '8px'),
  // TODO Delete this comment after verifying spacing token -> previous value ``${5 * gridSize}px``
  paddingLeft: token('spacing.scale.500', '40px'),
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
const ActionsContainer: FC = ({ children }) => (
  <div css={actionsStyles}>{children}</div>
);

export default ActionsContainer;
