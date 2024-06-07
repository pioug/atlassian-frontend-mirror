import React from 'react';

import { components, type ControlProps } from '@atlaskit/select';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type SelectOption } from './types';

const popupCustomControlStyles = () => ({
	display: 'flex',
	padding: token('space.050', '4px'),
	borderBottom: `solid 1px ${token('color.border', N40)}`,
});

export const CustomControl = ({ children, ...innerProps }: ControlProps<SelectOption, true>) => (
	<components.Control {...innerProps} getStyles={popupCustomControlStyles}>
		{children}
	</components.Control>
);

export default CustomControl;
