import React from 'react';

import { IntlProvider } from 'react-intl-next';

export const withIntl = (child: React.ReactNode) => (
	<IntlProvider locale="en">{child}</IntlProvider>
);
