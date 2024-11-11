import React, { useEffect, useState } from 'react';

import { type FieldProps } from '@atlaskit/form';
import {
	ActionOperationStatus,
	type AtomicActionExecuteResponse,
	type Status,
} from '@atlaskit/linking-types';
import Lozenge from '@atlaskit/lozenge';
import { type FilterOptionOption } from '@atlaskit/react-select';
import Select from '@atlaskit/select';

import type { ExecuteFetch } from '../../../../state/actions';
import type { DatasourceTypeWithOnlyValues } from '../../types';

interface Props extends Omit<FieldProps<string>, 'value'> {
	currentValue: DatasourceTypeWithOnlyValues;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
	executeFetch?: ExecuteFetch;
}

const StatusEditType = (props: Props) => {
	const { currentValue, executeFetch } = props;
	const { options, isLoading } = useStatusOptions(currentValue, executeFetch);

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
				defaultValue={currentValue?.values?.[0] as Status}
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

const useStatusOptions = (
	currentValue: DatasourceTypeWithOnlyValues,
	executeFetch?: <E>(inputs: any) => Promise<E>,
) => {
	const [{ options, isLoading }, setOptions] = useState({
		isLoading: true,
		options: [] as Status[],
	});

	useEffect(() => {
		let isMounted = true;
		loadOptions(currentValue, executeFetch).then((options) => {
			if (isMounted) {
				setOptions({ isLoading: false, options });
			}
		});
		return () => {
			isMounted = false;
		};
	}, [currentValue, executeFetch]);

	return { options, isLoading };
};

const loadOptions = async (
	currentValue: DatasourceTypeWithOnlyValues,
	executeFetch?: ExecuteFetch,
): Promise<Status[]> => {
	if (executeFetch) {
		const result = await executeFetch<AtomicActionExecuteResponse<Status>>({});

		const { operationStatus, entities } = result;

		if (operationStatus === ActionOperationStatus.SUCCESS && entities) {
			return entities.map((entity) => ({
				id: entity.id,
				text: entity.text,
				style: entity.style,
				transitionId: entity.transitionId,
			}));
		}
	}

	return [];
};

export default StatusEditType;
