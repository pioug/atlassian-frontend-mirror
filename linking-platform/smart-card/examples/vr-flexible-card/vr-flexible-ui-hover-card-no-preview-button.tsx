/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { CardClient } from '@atlaskit/link-provider';

import { JiraIssue } from '../../examples-helpers/_jsonLDExamples';
import { Card, Provider, SnippetBlock, TitleBlock } from '../../src';
import { getJsonLdResponse } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

class MaximumResolvedCustomClient extends CardClient {
	fetchData(url: string) {
		return Promise.resolve(getJsonLdResponse(url, JiraIssue.meta, JiraIssue.data));
	}
}

export default () => (
	<VRTestWrapper>
		<Provider client={new MaximumResolvedCustomClient()}>
			<Card
				appearance="block"
				url={'https://product-fabric.atlassian.net/wiki/spaces/EM'}
				showHoverPreview={true}
				actionOptions={{ hide: true }}
			>
				<TitleBlock hideTitleTooltip={true} />
				<SnippetBlock />
			</Card>
		</Provider>
	</VRTestWrapper>
);
