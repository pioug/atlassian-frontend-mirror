import React from 'react';

import CloseIcon from '@atlaskit/icon/core/migration/cross-circle';
import SearchIcon from '@atlaskit/icon/core/migration/search';
import { Box, xcss } from '@atlaskit/primitives';
import { components, type DropdownIndicatorProps } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import { type SelectOption } from './types';

const customDropdownIndicatorStyles = xcss({
	display: 'flex',
	cursor: 'pointer',
	justifyContent: 'center',
	width: token('space.400', '32px'),
});

const CustomDropdownIndicator = (props: DropdownIndicatorProps<SelectOption, true>) => {
	const { selectProps } = props;
	return (
		<components.DropdownIndicator {...props}>
			<Box
				xcss={customDropdownIndicatorStyles}
				onClick={() => {
					if (selectProps.inputValue) {
						selectProps.onInputChange &&
							selectProps.onInputChange('', {
								action: 'input-change',
								prevInputValue: selectProps.inputValue,
							});
					}
				}}
			>
				{selectProps.inputValue ? (
					<CloseIcon LEGACY_size="small" label="" color="currentColor" />
				) : (
					<SearchIcon LEGACY_size="small" label="" color="currentColor" />
				)}
			</Box>
		</components.DropdownIndicator>
	);
};

export default CustomDropdownIndicator;
