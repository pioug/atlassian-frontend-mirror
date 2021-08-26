/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize as getGridSize } from '@atlaskit/theme/constants';

const gridSize = getGridSize();

const actionsStyles = css({
  display: 'flex',
  marginBottom: `${gridSize}px`,
  paddingLeft: `${5 * gridSize}px`,
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
