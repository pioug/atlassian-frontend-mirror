import { Errors } from './main';

export const numberValidate = (isRequired: boolean, value?: string): Errors | undefined => {
	if (isRequired && !value) {
		return Errors.EMPTY;
	}

	if (value && Number.isNaN(Number(value))) {
		return Errors.INVALID_NUMBER;
	}

	return undefined;
};
