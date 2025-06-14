import Button from '@atlaskit/button/new';
import React, { useRef, useState } from 'react';
import { exampleOptions } from '../example-helpers';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';
import type { UserPickerRef, OnChange, Value } from '../src/types';

type ExampleProps = {};
type ExampleForwardedRefProps = {
	onChange: OnChange;
	value: Value;
};

const ExampleForwardedRef = (props: ExampleForwardedRefProps) => {
	let { onChange, value } = props;
	const ref = useRef<UserPickerRef>(null);
	return (
		<ExampleWrapper>
			{({ options, onInputChange }) => (
				<div>
					<UserPicker
						fieldId="example"
						options={options}
						onChange={onChange}
						onInputChange={onInputChange}
						isMulti
						value={value}
						defaultValue={[exampleOptions[0], exampleOptions[1]]}
						forwardedRef={ref}
					/>

					<Button
						onClick={() => {
							if (ref.current) {
								ref.current.focus();
							}
						}}
					>
						Focus Picker
					</Button>
				</div>
			)}
		</ExampleWrapper>
	);
};

const Example = (props: ExampleProps) => {
	const [selectedEntities, setSelectedEntities] = useState<Value>([] as Value);

	const handleSelectEntities = (selectedEntities: Value) => {
		setSelectedEntities(selectedEntities);
	};
	return <ExampleForwardedRef onChange={handleSelectEntities} value={selectedEntities} />;
};
export default Example;
