/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Card, Client, Provider } from '@atlaskit/smart-card';
import { VRTestWrapper } from './utils/vr-test';
import { type JsonLd } from 'json-ld-types';
import { BitbucketFile1 } from '../examples-helpers/_jsonLDExamples';
import { useCallback, useState } from 'react';
import { type CardStore } from '@atlaskit/linking-common';
import Button from '@atlaskit/button/new';

class CustomClient extends Client {
	fetchData() {
		return Promise.resolve(BitbucketFile1 as JsonLd.Response<JsonLd.Data.Document>);
	}
}

export default () => {
	const [initialState, setInitialState] = useState<CardStore>({});
	const resetInitialStoreState = useCallback(() => {
		setInitialState({});
	}, [setInitialState]);
	return (
		<VRTestWrapper title="Edge case: reload links when redux store is has been reset">
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
		</VRTestWrapper>
	);
};
