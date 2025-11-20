import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { BitbucketFile1 } from '@atlaskit/link-test-helpers';
import { type CardStore } from '@atlaskit/linking-common';
import { Card } from '@atlaskit/smart-card';

import ExampleContainer from './utils/example-container';

class CustomClient extends Client {
	fetchData() {
		return Promise.resolve(BitbucketFile1 as JsonLd.Response<JsonLd.Data.Document>);
	}
}

export default (): React.JSX.Element => {
	const [initialState, setInitialState] = useState<CardStore>({});
	const resetInitialStoreState = useCallback(() => {
		setInitialState({});
	}, [setInitialState]);
	return (
		<ExampleContainer title="Edge case: reload links when redux store is has been reset">
			<Provider client={new CustomClient('staging')} storeOptions={{ initialState }}>
				<Button
					testId={'reset-redux-store-button'}
					appearance={'primary'}
					onClick={resetInitialStoreState}
				>
					Reset store initial state
				</Button>
				<br />
				<br />
				<Card
					appearance="inline"
					testId="inline-card"
					url={'https://bitbucket.org/atlassian/atlassian-frontend/src/master/README.md'}
				/>
			</Provider>
		</ExampleContainer>
	);
};
