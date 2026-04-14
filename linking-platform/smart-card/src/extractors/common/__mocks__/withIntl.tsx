import React from 'react';

import { IntlProvider } from 'react-intl';

export const withIntl = (child: React.ReactNode): React.JSX.Element => (
	<IntlProvider locale="en">{child}</IntlProvider>
);
