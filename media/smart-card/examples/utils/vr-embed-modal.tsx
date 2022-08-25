import EmbedModal from '../../src/view/EmbedModal';
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { AtlassianIcon } from '@atlaskit/logo';
import { overrideEmbedContent } from './common';
import { VRTestWrapper } from './vr-test';

export const renderEmbedModalVrTest = (
  title: string,
  size: 'control' | 'large' | 'small' = 'small',
) => (
  <VRTestWrapper title={title}>
    <IntlProvider locale="en">
      <EmbedModal
        download="https://download-url"
        featureFlags={{ embedModalSize: size }}
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
