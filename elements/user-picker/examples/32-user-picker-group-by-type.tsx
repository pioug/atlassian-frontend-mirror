import React, { useState, useEffect } from 'react';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import { exampleOptions } from '../example-helpers';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';
import { type OnChange, type Value } from '../src/types';

type ExampleProps = {};
type ExampleInternalProps = {
	onChange: OnChange;
	value: Value;
};

const ExampleInternal = (props: ExampleInternalProps) => {
	let { onChange, value } = props;

	// Enable the feature flag for this example
	useEffect(() => {
		setBooleanFeatureFlagResolver((flagKey) => {
			if (flagKey === 'support_group_by_type_for_user_picker') {
				return true;
			}
			// Return false for other flags
			return false;
		});
	}, []);

	return (
		<>
			<ExampleWrapper>
				{({ options, onInputChange }) => (
					<UserPicker
						fieldId="example"
						options={options}
						onChange={onChange}
						onInputChange={onInputChange}
						isMulti
						value={value}
						defaultValue={[exampleOptions[0], exampleOptions[1]]}
						groupByTypeOrder={['team', 'group']}
					/>
				)}
			</ExampleWrapper>
			<>
				The groupByTypeOrder prop is only available if the support_group_by_type_for_user_picker
				feature flag is enabled
			</>
		</>
	);
};

const Example = (props: ExampleProps) => {
	const [selectedEntities, setSelectedEntities] = useState<Value>([] as Value);

	const handleSelectEntities = (selectedEntities: Value) => {
		setSelectedEntities(selectedEntities);
	};
	return <ExampleInternal onChange={handleSelectEntities} value={selectedEntities} />;
};
export default Example;
