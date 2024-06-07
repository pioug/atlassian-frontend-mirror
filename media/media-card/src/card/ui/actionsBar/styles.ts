import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

import { transition } from '../styles';

export const actionsBarClassName = 'media-card-actions-bar';

export const fixedActionBarStyles = `opacity: 1;`;

export const wrapperStyles = (isFixed?: boolean) =>
	css(isFixed ? fixedActionBarStyles : 'opacity: 0;', transition(), {
		position: 'absolute',
		top: token('space.100', '8px'),
		right: token('space.100', '8px'),
		display: 'flex',
		flexFlow: 'row nowrap',
		alignItems: 'center',
	});

wrapperStyles.displayName = 'ActionsBarWrapper';
