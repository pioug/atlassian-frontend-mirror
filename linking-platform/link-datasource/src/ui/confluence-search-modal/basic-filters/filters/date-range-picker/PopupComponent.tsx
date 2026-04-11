import React, { forwardRef } from 'react';

import { styled } from '@compiled/react';

import type { PopupComponentProps } from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const PopupComponentContainer = styled.div({
	boxSizing: 'border-box',
	display: 'block',
	flex: '1 1 auto',
	overflow: 'visible',
	borderRadius: token('radius.small', '4px'),
	backgroundColor: token('color.background.input'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':focus': {
		outline: 'none',
	},
	boxShadow: token('elevation.shadow.overlay'),
});

export const PopupComponent: React.ForwardRefExoticComponent<
	PopupComponentProps & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, PopupComponentProps>((props, ref) => (
	<PopupComponentContainer
		{...props}
		data-testId={'confluence-search-datasource-popup-container'}
		ref={ref}
	/>
));
