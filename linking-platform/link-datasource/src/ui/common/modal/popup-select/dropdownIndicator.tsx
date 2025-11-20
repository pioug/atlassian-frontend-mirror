import React from 'react';

import { cssMap } from '@compiled/react';

import CloseIcon from '@atlaskit/icon/core/cross-circle';
import SearchIcon from '@atlaskit/icon/core/search';
import { Pressable } from '@atlaskit/primitives/compiled';
import { components, type DropdownIndicatorProps } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import { type SelectOption } from './types';

const styles = cssMap({
	customDropdownIndicatorStylesOld: {
		display: 'flex',
		cursor: 'pointer',
		justifyContent: 'center',
		width: '32px',
	},
	customDropdownIndicatorStyles: {
		display: 'flex',
		cursor: 'pointer',
		justifyContent: 'center',
		width: '32px',
		backgroundColor: 'transparent',
		color: token('color.text.subtle'),
	},
});

const CustomDropdownIndicator = (
	props: DropdownIndicatorProps<SelectOption, true>,
): React.JSX.Element => {
	const { selectProps } = props;

	return (
		<components.DropdownIndicator {...props}>
			<Pressable
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
			</Pressable>
		</components.DropdownIndicator>
	);
};

export default CustomDropdownIndicator;
