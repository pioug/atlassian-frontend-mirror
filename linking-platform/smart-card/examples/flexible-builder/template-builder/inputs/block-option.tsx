import React, { useCallback } from 'react';

import { Field } from '@atlaskit/form';
import Select from '@atlaskit/select/Select';

import { BlockName } from '../../constants';

const blockOptions = Object.values(BlockName).map((value) => ({
	label: value,
	value,
}));

const BlockOption = ({ onClick }: { onClick: (name: BlockName) => void }) => {
	const handleOnChange = useCallback(
		(option: any) => {
			onClick(option.value);
		},
		[onClick],
	);
	return (
		<Field name="block" defaultValue={null}>
			{({ fieldProps: { id, ...rest } }) => (
				<Select
					inputId="block-select"
					placeholder="Add a block"
					{...rest}
					onChange={handleOnChange}
					options={blockOptions}
				/>
			)}
		</Field>
	);
};

export default BlockOption;
