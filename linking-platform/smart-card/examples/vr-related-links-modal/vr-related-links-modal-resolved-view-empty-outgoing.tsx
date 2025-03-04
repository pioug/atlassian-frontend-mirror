import React from 'react';

import { SmartCardProvider as Provider } from '@atlaskit/link-provider';
import type { CardState } from '@atlaskit/linking-common';

import {
	AtlasProject,
	ConfluenceBlogPost,
	ConfluencePage,
	JiraIssue,
	SlackMessage,
} from '../../examples-helpers/_jsonLDExamples';
import RelatedLinksBaseModal from '../../src/view/RelatedLinksModal/components/RelatedLinksBaseModal';
import RelatedLinksResolvedView from '../../src/view/RelatedLinksModal/views/resolved';
import VRTestWrapper from '../utils/vr-test-wrapper';

const initialState = Object.entries({
	[ConfluenceBlogPost.data.url]: ConfluenceBlogPost,
	[ConfluencePage.data.url]: ConfluencePage,
	[AtlasProject.data.url]: AtlasProject,
	[SlackMessage.data.url]: SlackMessage,
	[JiraIssue.data.url]: JiraIssue,
}).reduce(
	(prev, [key, details]) => ({
		...prev,
		[key]: { details, status: 'resolved' } as CardState,
	}),
	{},
);

export default () => (
	<VRTestWrapper
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			height: '700px',
		}}
	>
		<Provider storeOptions={{ initialState }}>
			<RelatedLinksBaseModal onClose={() => {}} showModal={true}>
				<RelatedLinksResolvedView
					incomingLinks={[
						ConfluenceBlogPost.data.url,
						AtlasProject.data.url,
						ConfluencePage.data.url,
						SlackMessage.data.url,
						JiraIssue.data.url,
					]}
					outgoingLinks={[]}
				/>
			</RelatedLinksBaseModal>
		</Provider>
	</VRTestWrapper>
);
