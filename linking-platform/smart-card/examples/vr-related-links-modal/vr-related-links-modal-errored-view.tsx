/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import VRTestWrapper from '../utils/vr-test-wrapper';
import RelatedLinksModal from '../../src/view/RelatedLinksModal/components/RelatedLinksBaseModal';
import RelatedLinksErroredView from '../../src/view/RelatedLinksModal/views/errored';

export default () => (
	<VRTestWrapper
		overrideCss={css({
			height: '700px',
		})}
	>
		<RelatedLinksModal onClose={() => {}} showModal={true}>
			<RelatedLinksErroredView />
		</RelatedLinksModal>
	</VRTestWrapper>
);
