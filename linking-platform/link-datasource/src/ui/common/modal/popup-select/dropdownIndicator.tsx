import React from 'react';

import { cssMap } from '@compiled/react';

import CloseIcon from '@atlaskit/icon/core/migration/cross-circle';
import SearchIcon from '@atlaskit/icon/core/migration/search';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { components, type DropdownIndicatorProps } from '@atlaskit/select';

import CustomDropdownIndicatorOld from './dropdownIndicatorOld';
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
				{selectProps.inputValue ? (
					<CloseIcon LEGACY_size="small" label="" color="currentColor" />
				) : (
					<SearchIcon LEGACY_size="small" label="" color="currentColor" />
				)}
			</Box>
		</components.DropdownIndicator>
	);
};

const CustomDropdownIndicatorExported = (props: DropdownIndicatorProps<SelectOption, true>) => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <CustomDropdownIndicator {...props} />;
	} else {
		return <CustomDropdownIndicatorOld {...props} />;
	}
};

export default CustomDropdownIndicatorExported;
