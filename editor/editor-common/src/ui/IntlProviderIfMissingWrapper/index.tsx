import React, { useContext } from 'react';

import { IntlContext, IntlProvider } from 'react-intl';

interface WrapProps {
	children: JSX.Element;
}

const useCheckIntlContext = () => useContext(IntlContext) === null;

export default function IntlProviderIfMissingWrapper({ children }: WrapProps): JSX.Element {
	const missingIntlContext = useCheckIntlContext();

	if (missingIntlContext) {
		return <IntlProvider locale="en">{children}</IntlProvider>;
	}
	return children;
}
