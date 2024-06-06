import React from 'react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import styled from '@emotion/styled';

import { Provider, Client, Card } from '../src';

const url = 'https://www.google.com';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ExampleWrapper = styled.div({
	width: '80%',
	height: 'auto',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
});

const CardWithLocationAnalytics = () => {
	const id = 'test-id';
	const location = 'this-is-a-test-product';

	return (
		<AnalyticsContext data={{ attributes: { location } }}>
			<Card id={id} url={url} appearance="block" />
		</AnalyticsContext>
	);
};

export default () => (
	<IntlProvider locale="en">
		<Provider client={new Client('stg')}>
			<ExampleWrapper>
				Try clicking this link!
				<CardWithLocationAnalytics />{' '}
			</ExampleWrapper>
		</Provider>
	</IntlProvider>
);
