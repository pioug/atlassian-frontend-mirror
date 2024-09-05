import { type FieldInputProps } from 'react-final-form';

import { type Validator } from '../../common/types';

type FieldProps = FieldInputProps<any, HTMLElement> & {
	fieldId: string;
	isInvalid: boolean;
	isRequired?: boolean;
	/** ID to reference an error message for the field */
	'aria-errormessage'?: string;
	/** ID to refer to description for field */
	'aria-describedby'?: string;
};

export type CreateFieldProps = {
	id?: string;
	/** Name passed to the <Field>.*/
	name: string;
	label?: string;
	/**
	 * Optional text below the textfield explaining any requirements for a valid value.
	 * eg. "Must be 4 or more letters"
	 */
	validationHelpText?: string;
	/** Validators for this field */
	validators?: Validator[];

	isRequired?: boolean;

	testId: string;

	children: (fieldProps: FieldProps) => React.ReactNode;
};
