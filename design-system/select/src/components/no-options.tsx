import React from 'react';

import { Text } from '@atlaskit/primitives';
import { components } from '@atlaskit/react-select';

import { type NoticeProps, type OptionType } from '../types';

/**
 * __No options message__
 */
export const NoOptionsMessage = (props: NoticeProps<OptionType>) => {
	return (
		<components.NoOptionsMessage {...props}>
			<Text color="color.text.subtle">{props.children || `No options`}</Text>
		</components.NoOptionsMessage>
	);
};
