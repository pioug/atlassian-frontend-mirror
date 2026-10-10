import React from 'react';

import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';
import { AtlasProject } from '@atlaskit/link-test-helpers/smart-card/mocks/atlas';
import {
	ConfluenceBlogPost,
	ConfluencePage,
} from '@atlaskit/link-test-helpers/smart-card/mocks/confluence';
import { JiraIssue } from '@atlaskit/link-test-helpers/smart-card/mocks/jira';
import { SlackMessage } from '@atlaskit/link-test-helpers/smart-card/mocks/slack';
import type { CardState } from '@atlaskit/linking-common/store';

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

export default (): React.JSX.Element => (
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
