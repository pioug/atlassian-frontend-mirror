/* eslint-disable @atlaskit/design-system/no-nested-styles */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC } from 'react';

import { css, jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import type { Status } from '../types';

const progressMarkerStyles = css({
	width: token('space.100', '8px'),
	height: token('space.100', '8px'),
	position: 'absolute',
	borderRadius: token('space.100', '8px'),
	insetInlineStart: '50%',
	transform: `translate(-50%, calc(-1 * ${token('space.250')}))`,
	transition: `background-color var(--ds--pt--ts) var(--ds--pt--te)`,
});

const markerColor = cssMap({
	unvisited: {
		backgroundColor: token('color.background.neutral.bold'),
	},
	current: {
		backgroundColor: token('color.background.brand.bold'),
	},
	visited: {
		backgroundColor: token('color.background.brand.bold'),
	},
	disabled: {
		backgroundColor: token('color.background.disabled'),
	},
});

/**
 * __Progress marker__
 *
 * Similar to `@atlaskit/progress-indicator`, a small visual circle marker
 */
const ProgressMarker: FC<{ testId?: string; status: Status }> = ({
	testId,
	status = 'unvisited',
}) => <div data-testid={testId} css={[progressMarkerStyles, markerColor[status]]} />;

export default ProgressMarker;
