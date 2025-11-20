import React from 'react';

import RelatedLinksModal from '../../src/view/RelatedLinksModal/components/RelatedLinksBaseModal';
import RelatedLinksErroredView from '../../src/view/RelatedLinksModal/views/errored';
import VRTestWrapper from '../utils/vr-test-wrapper';

export default (): React.JSX.Element => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
	<VRTestWrapper style={{ height: '700px' }}>
		<RelatedLinksModal onClose={() => {}} showModal={true}>
			<RelatedLinksErroredView />
		</RelatedLinksModal>
	</VRTestWrapper>
);
