import React from 'react';

import { Label } from '@atlaskit/form';
import EmojiIcon from '@atlaskit/icon/core/migration/emoji';
import Select, { components, type DropdownIndicatorProps, type OptionType } from '@atlaskit/select';

import { cities } from '../common/data';

const DropdownIndicator = (props: DropdownIndicatorProps<OptionType, true>) => {
	return (
		<components.DropdownIndicator {...props}>
			<EmojiIcon label="Emoji" />
		</components.DropdownIndicator>
	);
};

export default () => (
	<>
		<Label htmlFor="indicators-dropdown">What city do you live in?</Label>
		<Select
			inputId="indicators-dropdown"
			closeMenuOnSelect={false}
			components={{ DropdownIndicator }}
			defaultValue={[cities[4], cities[5]]}
			isMulti
			options={cities}
		/>
	</>
);
