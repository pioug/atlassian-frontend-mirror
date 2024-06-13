import React from 'react';
import { AtlassianIcon } from '@atlaskit/logo';
import { mockAnalytics } from '../src/utils/mocks';
import { overrideEmbedContent } from './utils/common';
import VRTestWrapper from './utils/vr-test-wrapper';
import EmbedModal from '../src/view/EmbedModal';
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Ignored via go/DSP-18766
import './utils/embed-modal-override.css';
import { css } from '@emotion/react';

export default () => (
	<VRTestWrapper
		overrideCss={css({
			height: '700px',
		})}
	>
		<EmbedModal
			analytics={mockAnalytics}
			download="https://download-url"
			icon={{ icon: <AtlassianIcon appearance="brand" /> }}
			iframeName="iframe-name"
			onClose={() => {}}
			providerName="Nowhere"
			showModal={true}
			src={overrideEmbedContent}
			title="This is a visual regression test for embed modal"
			testId="vr-test"
			url="https://link-url"
		/>
	</VRTestWrapper>
);
