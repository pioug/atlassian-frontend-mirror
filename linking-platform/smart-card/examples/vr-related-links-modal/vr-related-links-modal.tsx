/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import VRTestWrapper from '../utils/vr-test-wrapper';
import RelatedLinksModal from "../../src/view/RelatedLinksModal/components/RelatedLinksBaseModal";

export default () => (
  <VRTestWrapper
    overrideCss={css({
      height: '700px',
    })}
  >
    <RelatedLinksModal onClose={() => {}} showModal={true} children={undefined} />
  </VRTestWrapper>
);
