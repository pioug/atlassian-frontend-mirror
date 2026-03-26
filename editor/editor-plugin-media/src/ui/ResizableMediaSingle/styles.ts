// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const NOTIFICATION_SIZE = 8;
const SPACE_FROM_EDGE = token('space.100');

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const resizableMediaMigrationNotificationStyle: SerializedStyles = css({
	position: 'absolute',
	top: SPACE_FROM_EDGE,
	right: `calc(${token('space.150')} + ${SPACE_FROM_EDGE})`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	backgroundColor: token('color.background.warning.bold'),
	borderRadius: token('radius.full', '50%'),
	width: `${NOTIFICATION_SIZE}px`,
	height: `${NOTIFICATION_SIZE}px`,
	pointerEvents: 'none',
});
