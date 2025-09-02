import React from 'react';

import { cssMap } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled';
import { components, type ControlProps } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import { type SelectOption } from './types';

const getPopupCustomControlStyles = () => ({
	display: 'flex',
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	border: `solid 1px ${token('color.border.input', '#8C8F97')}`,
	minHeight: 'auto',
});

const popupCustomControlStyles = cssMap({
	container: {
		paddingTop: token('space.050', '4px'),
		paddingBottom: token('space.050', '4px'),
		paddingLeft: token('space.100', '4px'),
		paddingRight: token('space.100', '4px'),
	},
	control: {
		'&:focus-within': {
			boxShadow: 'none',
		},
	},
});

export const CustomControl = ({ children, ...innerProps }: ControlProps<SelectOption, true>) => (
	<Box xcss={popupCustomControlStyles.container}>
		<components.Control
			{...innerProps}
			getStyles={getPopupCustomControlStyles}
			xcss={popupCustomControlStyles.control}
		>
			{children}
		</components.Control>
	</Box>
);

export default CustomControl;
