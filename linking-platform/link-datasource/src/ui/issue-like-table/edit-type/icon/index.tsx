import React, { useEffect, useState } from 'react';

import { type FieldProps } from '@atlaskit/form';
import {
	ActionOperationStatus,
	type AtomicActionExecuteResponse,
	type Icon,
} from '@atlaskit/linking-types';
// FilterOptionOption is used in the filterOption function which is part of the public API, but the type itself is not exported
// eslint-disable-next-line import/no-extraneous-dependencies,no-restricted-imports
import { type FilterOptionOption } from '@atlaskit/react-select/src/filters';
import Select from '@atlaskit/select';

import { type ExecuteFetch } from '../../../../state/actions';
import { SharedIconComponent } from '../../shared-components/icon';
import type { DatasourceTypeWithOnlyTypeValues, DatasourceTypeWithOnlyValues } from '../../types';

interface Props extends Omit<FieldProps<string>, 'value'> {
	currentValue: DatasourceTypeWithOnlyTypeValues<'icon'>;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
	executeFetch?: ExecuteFetch;
}

/**
 * Should be gated by FF rollout of platform-datasources-enable-two-way-sync-priority
 */
const IconEditType = (props: Props) => {
	const { currentValue, executeFetch } = props;
	const { options, isLoading } = usePriorityOptions(currentValue, executeFetch);

	return (
		<div>
			<Select<Icon>
				{...props}
				testId="inline-edit-priority"
				autoFocus
				defaultMenuIsOpen
				blurInputOnSelect
				getOptionValue={(option) => option.text || ''}
				options={options}
				isLoading={isLoading}
				defaultValue={currentValue?.values?.[0]}
				filterOption={filterOption}
				formatOptionLabel={({ source, label, text }) => (
					<SharedIconComponent
						iconUrl={source}
						text={text}
						label={label}
						testId={`inline-edit-priority-option-${label}`}
					/>
				)}
				onChange={(e) =>
					props.setEditValues({
						type: 'icon',
						values: e ? [e] : [],
					})
				}
			/>
		</div>
	);
};

const filterOption = (option: FilterOptionOption<Icon>, inputValue: string) =>
	option.label.toLowerCase().includes(inputValue.toLowerCase());

const usePriorityOptions = (
	currentValue: DatasourceTypeWithOnlyTypeValues<'icon'>,
	executeFetch?: ExecuteFetch,
) => {
	const [{ options, isLoading }, setOptions] = useState<{ isLoading: boolean; options: Icon[] }>({
		isLoading: true,
		options: [],
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

/**
 * Load options for the select
 */
const loadOptions = async (
	_currentValue: DatasourceTypeWithOnlyTypeValues<'icon'>,
	executeFetch?: ExecuteFetch,
): Promise<Icon[]> => {
	if (!executeFetch) {
		return [];
	}

	const { operationStatus, entities } = await executeFetch<AtomicActionExecuteResponse<Icon>>({});

	if (operationStatus === ActionOperationStatus.SUCCESS && entities) {
		// Map entities here if the backend type is different from the type required by the select
		return entities;
	}
	return [];
};

export default IconEditType;
