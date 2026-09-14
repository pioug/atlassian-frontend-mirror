/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';

import { Card } from '../../src';
import { mockConfluenceResponse } from '../../src/view/HoverCard/__tests__/__mocks__/mocks';
import VRTestWrapper from '../utils/vr-test-wrapper';

import '../utils/vr-preload-metadata-icons';

class CustomClient extends Client {
	fetchData(_: string) {
		return Promise.resolve(mockConfluenceResponse as JsonLd.Response);
	}
}

const styles = css({
	marginTop: 250,
});

export default (): JSX.Element => (
	<VRTestWrapper>
		<Provider client={new CustomClient('staging')}>
			<div css={styles}>
				<Card
					url={'https://www.mockurl.com'}
					appearance="inline"
					showHoverPreview={true}
					hoverPreviewOptions={{ fadeInDelay: 0 }}
				/>
			</div>
		</Provider>
	</VRTestWrapper>
);
