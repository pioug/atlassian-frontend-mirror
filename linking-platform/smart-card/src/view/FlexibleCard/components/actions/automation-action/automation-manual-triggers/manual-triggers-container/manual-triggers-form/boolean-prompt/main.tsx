import React from 'react';

import { di } from 'react-magnetic-di';

import Checkbox from '@atlaskit/checkbox';
import { CheckboxField } from '@atlaskit/form';

import type { UserInputBooleanPrompt } from '../../common/types';

interface BooleanInputPromptProps {
	userInputPrompt: UserInputBooleanPrompt;
}

const BooleanInputPrompt = ({ userInputPrompt }: BooleanInputPromptProps): React.JSX.Element => {
	di(Checkbox, CheckboxField);

	const { variableName, displayName, defaultValue } = userInputPrompt;

	return (
		<CheckboxField name={variableName} defaultIsChecked={defaultValue || false}>
			{({ fieldProps }) => <Checkbox {...fieldProps} label={displayName} />}
		</CheckboxField>
	);
};

export default BooleanInputPrompt;
