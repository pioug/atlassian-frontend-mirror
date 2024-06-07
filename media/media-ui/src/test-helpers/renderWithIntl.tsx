import React from 'react';
import { IntlProvider } from 'react-intl-next';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, type RenderResult } from '@testing-library/react';

export const renderWithIntl = (component: React.ReactNode): RenderResult => {
	return render(<IntlProvider locale="en">{component}</IntlProvider>);
};
