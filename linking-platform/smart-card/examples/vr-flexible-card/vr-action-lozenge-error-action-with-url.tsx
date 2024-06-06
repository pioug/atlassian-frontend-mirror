import React from 'react';
import { SmartCardProvider } from '@atlaskit/link-provider';
import LozengeActionError from '../../src/view/FlexibleCard/components/elements/lozenge/lozenge-action/lozenge-action-error';
import VRTestWrapper from '../utils/vr-test-wrapper';

const TEXT_ERROR_MESSAGE = 'Custom error message for VR test';
const url = 'https://linchen.jira-dev.com/browse/AT-1';

const previewData = {
	isSupportTheming: true,
	linkIcon: {
		url: 'https://linchen.jira-dev.com/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315',
	},
	providerName: 'Jira',
	src: 'https://some-jira-instance/browse/AT-1/embed?parentProduct=smartlink',
	title: 'AT-1: TESTTTTTT',
	url,
};

export default () => (
	<VRTestWrapper>
		<SmartCardProvider>
			<LozengeActionError previewData={previewData} errorMessage={TEXT_ERROR_MESSAGE} />
		</SmartCardProvider>
	</VRTestWrapper>
);
