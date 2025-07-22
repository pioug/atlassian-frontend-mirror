import React from 'react';

import { cssMap } from '@compiled/react';

import CloseIcon from '@atlaskit/icon/core/cross-circle';
import SearchIcon from '@atlaskit/icon/core/search';
import { Box } from '@atlaskit/primitives/compiled';
import { components, type DropdownIndicatorProps } from '@atlaskit/select';

import { type SelectOption } from './types';

const styles = cssMap({
	customDropdownIndicatorStyles: {
		display: 'flex',
		cursor: 'pointer',
		justifyContent: 'center',
		width: '32px',
	},
});

const CustomDropdownIndicator = (props: DropdownIndicatorProps<SelectOption, true>) => {
	const { selectProps } = props;

	return (
		<components.DropdownIndicator {...props}>
			{/* eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable */}
			<Box
				xcss={styles.customDropdownIndicatorStyles}
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
				{selectProps.inputValue ? <CloseIcon label="" /> : <SearchIcon label="" />}
			</Box>
		</components.DropdownIndicator>
	);
};

export default CustomDropdownIndicator;
