import React from 'react';

import { useIntl } from 'react-intl-next';

export const MockDisclaimer = () => {
	const { locale } = useIntl();
	const parentLocale = locale.split(/[-_]/)[0];
	const disclaimer = 'This is a mocked plugin.';

	if (parentLocale !== 'en') {
		return (
			<p>
				{disclaimer} <small>{`(locale ${locale} not available)`}</small>
			</p>
		);
	}

	return <p>{disclaimer}</p>;
};
