import React from 'react';

import { cssMap } from '@compiled/react';

import CloseIcon from '@atlaskit/icon/core/cross-circle';
import CloseIconOld from '@atlaskit/icon/core/migration/cross-circle';
import SearchIconOld from '@atlaskit/icon/core/migration/search';
import SearchIcon from '@atlaskit/icon/core/search';
import { fg } from '@atlaskit/platform-feature-flags';
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

	const closeIcon = fg('platform-linking-visual-refresh-sllv') ? (
		<CloseIcon label="" />
	) : (
		<CloseIconOld LEGACY_size="small" label="" color="currentColor" />
	);
	const searchIcon = fg('platform-linking-visual-refresh-sllv') ? (
		<SearchIcon label="" />
	) : (
		<SearchIconOld LEGACY_size="small" label="" color="currentColor" />
	);

	return (
		<components.DropdownIndicator {...props}>
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
				{selectProps.inputValue ? closeIcon : searchIcon}
			</Box>
		</components.DropdownIndicator>
	);
};

export default CustomDropdownIndicator;
