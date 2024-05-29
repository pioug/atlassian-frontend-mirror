/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import VRTestWrapper from '../utils/vr-test-wrapper';
import RelatedLinksBaseModal from "../../src/view/RelatedLinksModal/components/RelatedLinksBaseModal";

export default () => (
  <VRTestWrapper
    overrideCss={css({
      height: '700px',
    })}
  >
    <RelatedLinksBaseModal onClose={() => {}} showModal={true} children={undefined} />
  </VRTestWrapper>
);
