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
	border: `solid ${token('border.width')} ${token('color.border.input')}`,
	minHeight: 'auto',
});

const popupCustomControlStyles = cssMap({
	container: {
		paddingTop: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.100'),
		paddingRight: token('space.100'),
	},
	control: {
		'&:focus-within': {
			boxShadow: 'none',
		},
	},
});

export const CustomControl = ({
	children,
	...innerProps
}: ControlProps<SelectOption, true>): React.JSX.Element => (
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
