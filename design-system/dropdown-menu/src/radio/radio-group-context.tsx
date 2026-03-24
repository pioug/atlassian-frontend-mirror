import React, { createContext } from 'react';

import noop from '@atlaskit/ds-lib/noop';

interface RadioGroupContextProps {
	id: string;
	radioGroupState: { [key: string]: boolean | undefined };
	selectRadioItem: (id: string, value: boolean) => void;
}

/**
 * __Radio group context__
 * Context provider that wraps each DropdownItemRadioGroup
 */
export const RadioGroupContext: React.Context<RadioGroupContextProps> =
	createContext<RadioGroupContextProps>({
		id: '',
		radioGroupState: {},
		selectRadioItem: noop,
	});
