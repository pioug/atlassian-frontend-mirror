import React from 'react';
import { type OptionType, type NoticeProps } from '../types';
import { components } from 'react-select';

export const NoOptionsMessage = (props: NoticeProps<OptionType>) => {
	return (
		<components.NoOptionsMessage {...props}>
			<span id="no-options" role="alert">
				{props.children || `No options`}
			</span>
		</components.NoOptionsMessage>
	);
};
