import React, { useEffect, useState } from 'react';

import { type FieldProps } from '@atlaskit/form';
import { type Status } from '@atlaskit/linking-types';
import Lozenge from '@atlaskit/lozenge';
// FilterOptionOption is used in the filterOption function which is part of the public API, but the type itself is not exported
// eslint-disable-next-line import/no-extraneous-dependencies,no-restricted-imports
import { type FilterOptionOption } from '@atlaskit/react-select/src/filters';
import Select from '@atlaskit/select';

import type { DatasourceTypeWithOnlyValues } from '../../types';

interface Props extends Omit<FieldProps<string>, 'value'> {
	currentValue: DatasourceTypeWithOnlyValues;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
}

const StatusEditType = (props: Props) => {
	const { options, isLoading } = useStatusOptions();

	return (
		<div>
			<Select<Status>
				{...props}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
				className="single-select"
				testId="inline-edit-status"
				autoFocus
				defaultMenuIsOpen
				blurInputOnSelect
				getOptionValue={(option) => option.text}
				options={options}
				isLoading={isLoading}
				defaultValue={props.currentValue?.values?.[0] as Status}
				filterOption={filterOption}
				formatOptionLabel={(option) => (
					<Lozenge testId={`inline-edit-status-option-${option.text}`} {...option.style}>
						{option.text}
					</Lozenge>
				)}
				onChange={(e) =>
					props.setEditValues({
						type: 'status',
						values: e ? [e] : [],
					})
				}
			/>
		</div>
	);
};

const filterOption = (option: FilterOptionOption<Status>, inputValue: string) =>
	option.data.text.toLowerCase().includes(inputValue.toLowerCase());

const useStatusOptions = () => {
	const [{ options, isLoading }, setOptions] = useState({
		isLoading: true,
		options: [] as Status[],
	});
	useEffect(() => {
		loadOptions().then((options) => setOptions({ isLoading: false, options }));
	}, []);
	return { options, isLoading };
};

const loadOptions = async (): Promise<Status[]> => {
	return new Promise<Status[]>((resolve) => {
		setTimeout(
			() =>
				resolve([
					{ text: 'To Do', id: '1', style: { appearance: 'default' } },
					{ text: 'In Progress', id: '1', style: { appearance: 'inprogress' } },
					{ text: 'Done', id: '2', style: { appearance: 'success' } },
				] as Status[]),
			1000,
		);
	});
};

export default StatusEditType;
