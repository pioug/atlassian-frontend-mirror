import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import { Box } from '@atlaskit/primitives';
import { Radio } from '@atlaskit/radio';

export default function RadioDefaultExample() {
	return (
		<Box>
			<Radio
				value="default radio"
				label="Default radio"
				name="radio-default"
				testId="radio-default"
				isChecked={true}
				onChange={noop}
			/>
			<Radio
				value="disabled radio"
				label="Disabled radio"
				name="radio-disabled"
				testId="radio-disabled"
				isChecked={false}
				isDisabled={true}
				onChange={noop}
			/>
		</Box>
	);
}
