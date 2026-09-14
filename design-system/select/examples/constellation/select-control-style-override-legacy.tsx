import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import Select from '@atlaskit/select/default';
import { token } from '@atlaskit/tokens';

import { cities } from '../common/data';

export default (): React.JSX.Element => (
	<>
		<Label htmlFor="indicators-dropdown">What city do you live in?</Label>
		<Select
			styles={{
				control: (provided, state) => ({
					...provided,
					backgroundColor: token('elevation.surface'),
					borderColor: state.isFocused ? token('color.border.selected') : token('color.border'),
				}),
			}}
			options={cities}
		/>
	</>
);
