import React from 'react';

import RelatedLinksModal from '../../src/view/RelatedLinksModal/components/RelatedLinksBaseModal';
import RelatedLinksUnavailableView from '../../src/view/RelatedLinksModal/views/unavailable';
import VRTestWrapper from '../utils/vr-test-wrapper';

export default (): React.JSX.Element => (
	<VRTestWrapper
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			height: '700px',
		}}
	>
		<RelatedLinksModal onClose={() => {}} showModal={true}>
			<RelatedLinksUnavailableView />
		</RelatedLinksModal>
	</VRTestWrapper>
);
