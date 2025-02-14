import React, { forwardRef } from 'react';

import { styled } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import type { PopupComponentProps } from '@atlaskit/popup';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { PopupComponentContainerOld } from './styled-old';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const PopupComponentContainer = styled.div({
	boxSizing: 'border-box',
	display: 'block',
	flex: '1 1 auto',
	overflow: 'visible',
	borderRadius: token('border.radius.100', '4px'),
	backgroundColor: token('color.background.input', N0),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':focus': {
		outline: 'none',
	},
	boxShadow: token(
		'elevation.shadow.overlay',
		'0px 0px 1px 0px rgba(9, 30, 66, 0.31), 0px 3px 5px 0px rgba(9, 30, 66, 0.20)',
	),
});

export const PopupComponentNew = forwardRef<HTMLDivElement, PopupComponentProps>((props, ref) => (
	<PopupComponentContainer
		{...props}
		data-testId={'confluence-search-datasource-popup-container'}
		ref={ref}
	/>
));

export const PopupComponentOld = forwardRef<HTMLDivElement, PopupComponentProps>((props, ref) => (
	<PopupComponentContainerOld
		{...props}
		data-testId={'confluence-search-datasource-popup-container'}
		ref={ref}
	/>
));

export const PopupComponent = forwardRef<HTMLDivElement, PopupComponentProps>((props, ref) => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <PopupComponentNew {...props} ref={ref} />;
	} else {
		return <PopupComponentOld {...props} ref={ref} />;
	}
});
