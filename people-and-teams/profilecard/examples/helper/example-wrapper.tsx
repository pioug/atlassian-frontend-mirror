import React from 'react';

import { IntlProvider } from 'react-intl-next';

type Props = {
	locale?: string;
	children: React.ReactNode;
};

const ExampleWrapper = (props: Props): React.JSX.Element => {
	const { locale = 'en', children } = props;

	return (
		<IntlProvider key={locale} locale={locale}>
			{children}
		</IntlProvider>
	);
};

export default ExampleWrapper;
