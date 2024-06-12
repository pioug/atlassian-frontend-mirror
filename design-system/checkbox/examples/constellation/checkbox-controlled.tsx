import React, { type ChangeEvent, useCallback, useState } from 'react';

import { Checkbox } from '../../src';

const CheckboxControlledExample = () => {
	const [isChecked, setIsChecked] = useState(true);
	const [onChangeResult, setOnChangeResult] = useState('true');

	const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setIsChecked((current) => !current);
		setOnChangeResult(`${event.target.checked}`);
	}, []);

	return (
		<Checkbox
			isChecked={isChecked}
			onChange={onChange}
			label={`Controlled checkbox, with props.isChecked: ${onChangeResult}`}
			value="Controlled Checkbox"
			name="controlled-checkbox"
		/>
	);
};

export default CheckboxControlledExample;
