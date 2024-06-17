/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import VRTestWrapper from '../utils/vr-test-wrapper';
import RelatedLinksResolvedView from '../../src/view/RelatedLinksModal/views/resolved';
import { Provider } from '@atlaskit/smart-card';
import type { CardState } from '@atlaskit/linking-common';
import {
	AtlasProject,
	ConfluenceBlogPost,
	ConfluencePage,
	JiraIssue,
	SlackMessage,
} from '../../examples-helpers/_jsonLDExamples';
import RelatedLinksBaseModal from '../../src/view/RelatedLinksModal/components/RelatedLinksBaseModal';

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
		overrideCss={css({
			height: '700px',
		})}
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
