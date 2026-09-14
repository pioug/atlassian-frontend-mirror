import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import EmojiIcon from '@atlaskit/icon/core/emoji';
import Select from '@atlaskit/select/default';
import type { DropdownIndicatorProps, OptionType } from '@atlaskit/select/types';
import { components } from '@atlaskit/react-select/components';

import { cities } from '../common/data';

const DropdownIndicator = (props: DropdownIndicatorProps<OptionType, true>) => {
	return (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		<components.DropdownIndicator {...props}>
			<EmojiIcon label="Emoji" />
		</components.DropdownIndicator>
	);
};

export default (): React.JSX.Element => (
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
