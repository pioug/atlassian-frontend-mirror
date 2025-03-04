import React from 'react';

import RelatedLinksBaseModal from '../../src/view/RelatedLinksModal/components/RelatedLinksBaseModal';
import RelatedLinksResolvingView from '../../src/view/RelatedLinksModal/views/resolving';
import VRTestWrapper from '../utils/vr-test-wrapper';

export default () => (
	<VRTestWrapper
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			height: '700px',
		}}
	>
		<RelatedLinksBaseModal onClose={() => {}} showModal={true}>
			<RelatedLinksResolvingView />
		</RelatedLinksBaseModal>
	</VRTestWrapper>
);
