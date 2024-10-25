/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Card, Client, Provider, type ResolveResponse } from '../../src';
import { mockConfluenceResponse } from '../../src/view/HoverCard/__tests__/__mocks__/mocks';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(mockConfluenceResponse as ResolveResponse);
	}
}

export default () => (
	<VRTestWrapper>
		<Provider client={new CustomClient('staging')}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginTop: 250 }}>
				<Card url={'https://www.mockurl.com'} appearance="inline" showHoverPreview={true} />
			</div>
		</Provider>
	</VRTestWrapper>
);
