// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Ignored via go/DSP-18766
import '../utils/embed-modal-override.css';
import React from 'react';

import { ActionName, IconType } from '../../src/constants';
import EmbedModal from '../../src/view/EmbedModal';
import { overrideEmbedContent } from '../utils/common';
import VRTestWrapper from '../utils/vr-test-wrapper';

export default () => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
	<VRTestWrapper style={{ height: '700px' }}>
		<EmbedModal
			invokeDownloadAction={{
				actionFn: async () => {},
				actionType: ActionName.DownloadAction,
			}}
			invokeViewAction={{
				actionFn: async () => {},
				actionType: ActionName.PreviewAction,
			}}
			linkIcon={{
				icon: IconType.Task,
			}}
			iframeName="iframe-name"
			onClose={() => {}}
			providerName="Nowhere"
			showModal={true}
			src={overrideEmbedContent}
			title="This is a visual regression test for embed modal"
			url="https://link-url"
		/>
	</VRTestWrapper>
);
