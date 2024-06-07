import React from 'react';

import { act, render, type RenderResult } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

export const renderWithIntl = (component: React.ReactNode): RenderResult => {
	return render(<IntlProvider locale="en">{component}</IntlProvider>);
};

export async function asyncAct(cb: () => Promise<any> | void) {
	try {
		await cb(); // make all effects resolve after
	} catch (err) {
		// This is to handle rejected promise
	}
	act(() => {});
}
