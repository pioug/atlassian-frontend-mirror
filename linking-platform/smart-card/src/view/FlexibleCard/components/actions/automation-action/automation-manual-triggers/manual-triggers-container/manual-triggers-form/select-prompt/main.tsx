import React from 'react';

import { di } from 'react-magnetic-di';

import { ErrorMessage, Field } from '@atlaskit/form';
import Select from '@atlaskit/select';

import messages from '../../common/messages';
import type { SelectorOption, UserInputSelectPrompt } from '../../common/types';

interface SelectInputPromptProps {
	userInputPrompt: UserInputSelectPrompt;
}

enum Errors {
	EMPTY = 'EMPTY',
}

const SelectInputPrompt = ({ userInputPrompt }: SelectInputPromptProps) => {
	di(ErrorMessage, Field, Select);

	const { variableName, required, displayName, defaultValue } = userInputPrompt;

	const validate = (value?: string): Errors | undefined => {
		if (required && !value) {
			return Errors.EMPTY;
		}

		return undefined;
	};

	const selectOptions: SelectorOption[] = defaultValue.map((value) => ({
		label: value,
		value,
	}));

	return (
		<Field name={variableName} label={displayName} isRequired={required} validate={validate}>
			{({ fieldProps, error }) => (
				<>
					{/* @ts-expect-error - TS2322 - Type '{ isClearable: boolean; isLoading?: boolean | undefined; isMulti: boolean; isSearchable: boolean; backspaceRemovesValue: boolean; blurInputOnSelect?: boolean | undefined; controlShouldRenderValue: boolean; ... 17 more ...; options: T[] | undefined; }' is not assignable to type 'Readonly<SelectProps<unknown, boolean>>'. */}
					<Select
						isClearable
						isSearchable
						options={selectOptions}
						menuPosition="fixed"
						{...fieldProps}
					/>
					{error === Errors.EMPTY && (
						<ErrorMessage>{messages.errorInputMustNotBeEmpty.defaultMessage}</ErrorMessage>
					)}
				</>
			)}
		</Field>
	);
};

export default SelectInputPrompt;
