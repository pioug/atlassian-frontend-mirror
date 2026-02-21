import { getIn } from 'final-form';
import type { FocusableInput } from 'final-form-focus';

export const getFirstErrorField: (
	inputs: FocusableInput[],
	errors: Object,
) => HTMLInputElement | undefined = (inputs: FocusableInput[], errors: Object) => {
	// Guaranteed to be of type HTMLInputElement[] due to getInputs function overrided in createDecorator
	let htmlInputs = inputs as HTMLInputElement[];

	return htmlInputs.find(function (input) {
		// If input is hidden, do not focus
		if (input.type === 'hidden') {
			return false;
		}

		// If input ID matches the error, focus
		if (input.id && getIn(errors, input.id)) {
			return true;
		}

		// Default to base behavior
		return input.name && getIn(errors, input.name);
	});
};
