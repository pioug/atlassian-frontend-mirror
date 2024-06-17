/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import VRTestWrapper from '../utils/vr-test-wrapper';
import RelatedLinksBaseModal from '../../src/view/RelatedLinksModal/components/RelatedLinksBaseModal';

export default () => (
	<VRTestWrapper
		overrideCss={css({
			height: '700px',
		})}
	>
		<RelatedLinksBaseModal onClose={() => {}} showModal={true} children={undefined} />
	</VRTestWrapper>
);
