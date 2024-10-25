// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Ignored via go/DSP-18766
import '../utils/embed-modal-override.css';
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { IconType, SmartLinkSize } from '../../src/constants';
import { mockAnalytics } from '../../src/utils/mocks';
import EmbedModal from '../../src/view/EmbedModal';
import Icon from '../../src/view/FlexibleCard/components/elements/icon';
import { overrideEmbedContent } from '../utils/common';
import VRTestWrapper from '../utils/vr-test-wrapper';

export default () => (
	<VRTestWrapper
		overrideCss={css({
			height: '700px',
		})}
	>
		<EmbedModal
			analytics={mockAnalytics}
			download="https://download-url"
			icon={{
				icon: <Icon icon={IconType.Task} size={SmartLinkSize.Large} />,
				isFlexibleUi: true,
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
