import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { transition } from '../styles';

export const actionsBarClassName = 'media-card-actions-bar';

export const fixedActionBarStyles = `opacity: 1;`;

export const wrapperStyles = (isFixed?: boolean) =>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	css(isFixed ? fixedActionBarStyles : 'opacity: 0;', transition(), {
		position: 'absolute',
		top: 0,
		display: 'flex',
		flexFlow: 'row nowrap',
		justifyContent: 'right',
		width: '100%',
		padding: token('space.100', '8px'),
		gap: token('space.100', '8px'),
	});

wrapperStyles.displayName = 'ActionsBarWrapper';
