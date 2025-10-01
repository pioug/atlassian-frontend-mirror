import React from 'react';

import HyperlinkUnauthorizedView from '../../src/view/LinkUrl/HyperlinkResolver/unauthorize-view';
import VRTestWrapper from '../utils/vr-test-wrapper';

const mockProvider = { text: 'SharePoint', key: 'sharepoint-object-provider' };

export default () => (
	<VRTestWrapper>
		<HyperlinkUnauthorizedView
			href="https://www.sharepoint.com/document.docx"
			showConnectBtn={true}
			onAuthorize={() => {}}
			provider={mockProvider}
		>
			SharePoint Document
		</HyperlinkUnauthorizedView>
	</VRTestWrapper>
);
