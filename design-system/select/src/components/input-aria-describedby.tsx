import React from 'react';

import { components, type InputProps } from '@atlaskit/react-select';

import type { OptionType } from '../types';

export function Input<Option = OptionType, IsMulti extends boolean = false>(
	props: InputProps<Option, IsMulti>,
) {
	let ariaDescribedByAttribute = props['aria-describedby'];
	const passed_describedby =
		props.selectProps['aria-describedby'] || props.selectProps.descriptionId;

	if (passed_describedby && !ariaDescribedByAttribute?.includes(passed_describedby)) {
		ariaDescribedByAttribute = props['aria-describedby'] + ' ' + passed_describedby;
	} else {
		ariaDescribedByAttribute = props['aria-describedby'] || passed_describedby;
	}

	return <components.Input {...props} aria-describedby={ariaDescribedByAttribute} />;
}
