import React from 'react';
import { IntlProvider } from 'react-intl-next';
import type { RenderResult } from '@testing-library/react';

/**
 * Lazy require to avoid loading @testing-library/react during SSR tests.
 * jest.resetModules() clears the cache, so RTL would register its hooks inside tests.
 */
export const renderWithIntl = (component: React.ReactNode): RenderResult => {
	const { render } = require('@testing-library/react');
	return render(<IntlProvider locale="en">{component}</IntlProvider>);
};
