import { createContext } from 'react';

import { type FormApi } from 'final-form';

import type { GetCurrentValue, RegisterField } from './types';

/**
 * __Form context__
 *
 * A form context creates a context for the field values and allows them to be accessed by the children.
 */
export const FormContext: React.Context<{
	registerField: RegisterField;
	getCurrentValue: GetCurrentValue;
	subscribe: FormApi['subscribe'];
}> = createContext<{
	registerField: RegisterField;
	getCurrentValue: GetCurrentValue;
	subscribe: FormApi['subscribe'];
}>({
	registerField: function () {
		return () => {};
	},
	getCurrentValue: () => undefined,
	subscribe: function () {
		return () => {};
	},
});
