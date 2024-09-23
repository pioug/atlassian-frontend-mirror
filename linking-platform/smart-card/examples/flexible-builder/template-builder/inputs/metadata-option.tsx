import { Field } from '@atlaskit/form';
import { type OptionsType, type ValueType as Value } from '@atlaskit/select';
import Select from '@atlaskit/select/Select';
import React, { useCallback, useMemo } from 'react';
import { type ElementItem, type ElementName } from '../../../../src';
import { metadataElements } from '../../../utils/flexible-ui';
import { type BlockTemplate } from '../../types';
import { type ChangeParams, handleOnChange } from '../../utils';

const options = metadataElements.map((name) => ({
	label: name,
	value: name,
}));

const MetadataOption = ({
	label,
	name,
	onChange,
	propName,
	template,
}: {
	label?: string;
	name: string;
	onChange: (template: BlockTemplate) => void;
	propName: keyof BlockTemplate;
	template: BlockTemplate;
}) => {
	const handleOnMetadataChange = useCallback(
		(...params: ChangeParams<BlockTemplate>) =>
			(values: OptionsType<{ label: string; value: ElementName }>) => {
				const items = values.map((option: { value: ElementName }) => ({
					name: option.value,
				}));

				handleOnChange<BlockTemplate>(...params, items);
			},
		[],
	);

	const values = useMemo(() => {
		const selectedValues = template[propName];
		if (selectedValues && selectedValues.length > 0) {
			return selectedValues.map((elementItem: ElementItem) =>
				options.find(({ value }) => value === elementItem.name),
			);
		}
	}, [propName, template]);

	return (
		<Field<Value<{ label: string; value: string }>> name={name} label={label}>
			{({ fieldProps: { id, ...rest } }) => (
				<Select
					{...rest}
					isMulti
					onChange={handleOnMetadataChange(onChange, template, propName, [])}
					options={options}
					placeholder="Add metadata"
					value={values}
				/>
			)}
		</Field>
	);
};

export default MetadataOption;
