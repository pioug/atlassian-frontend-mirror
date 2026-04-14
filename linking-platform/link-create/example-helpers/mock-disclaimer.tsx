import React from 'react';

import { useIntl } from 'react-intl';

import { Text } from '@atlaskit/primitives/compiled';

export const MockDisclaimer = (): React.JSX.Element => {
	const { locale } = useIntl();
	const parentLocale = locale.split(/[-_]/)[0];
	const disclaimer = 'This is a mocked plugin.';

	if (parentLocale !== 'en') {
		return (
			<Text as="p">
				{disclaimer} <Text>{`(locale ${locale} not available)`}</Text>
			</Text>
		);
	}

	return <Text as="p">{disclaimer}</Text>;
};
