import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { render, type RenderResult } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

export const renderWithIntl = (component: React.ReactNode): RenderResult => {
	return render(<IntlProvider locale="en">{component}</IntlProvider>);
};
