/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';

import { Card } from '../../src';
import { mocks } from '../utils/common';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(mocks.entityDataSuccess);
	}
}

const styles = css({
	marginTop: 250,
});

export default () => (
	<VRTestWrapper>
		<Provider client={new CustomClient('staging')}>
			<div css={styles}>
				<Card url={'https://www.mockurl.com'} appearance="inline" showHoverPreview={true} />
			</div>
		</Provider>
	</VRTestWrapper>
);
