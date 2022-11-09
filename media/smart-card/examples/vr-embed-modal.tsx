import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { AtlassianIcon } from '@atlaskit/logo';
import { mockAnalytics } from '../src/utils/mocks';
import { overrideEmbedContent } from './utils/common';
import { VRTestWrapper } from './utils/vr-test';
import EmbedModal from '../src/view/EmbedModal';

export default () => (
  <VRTestWrapper title="Embed Modal">
    <IntlProvider locale="en">
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
    </IntlProvider>
  </VRTestWrapper>
);
