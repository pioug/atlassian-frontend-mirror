import { css } from '@emotion/react';

import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const NOTIFICATION_SIZE = 8;
const SPACE_FROM_EDGE = token('space.100', '8px');

export const resizableMediaMigrationNotificationStyle = css({
	position: 'absolute',
	top: SPACE_FROM_EDGE,
	right: `calc(${token('space.150', '12px')} + ${SPACE_FROM_EDGE})`,
	backgroundColor: token('color.background.warning.bold', colors.Y300),
	borderRadius: token('border.radius.circle', '50%'),
	width: `${NOTIFICATION_SIZE}px`,
	height: `${NOTIFICATION_SIZE}px`,
	pointerEvents: 'none',
});
