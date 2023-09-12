import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import * as colors from '@atlaskit/theme/colors';

const NOTIFICATION_SIZE = 8;
const SPACE_FROM_EDGE = token('space.100', '8px');

export const resizableMediaMigrationNotificationStyle = css`
  position: absolute;
  top: ${SPACE_FROM_EDGE};
  right: calc(${token('space.150', '12px')} + ${SPACE_FROM_EDGE});
  background-color: ${token('color.background.warning.bold', colors.Y300)};
  border-radius: ${token('border.radius.circle', '50%')};
  width: ${NOTIFICATION_SIZE}px;
  height: ${NOTIFICATION_SIZE}px;
  pointer-events: none;
`;
