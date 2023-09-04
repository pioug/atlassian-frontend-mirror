import React from 'react';

import VRTestWrapper from '../utils/vr-test-wrapper';
import { ProviderProps, SmartCardProvider } from '@atlaskit/link-provider';
import { Card, CardProps } from '@atlaskit/smart-card';

type VRCardViewProps = {
  appearance: CardProps['appearance'];
  client: ProviderProps['client'];
  url?: CardProps['url'];
};

const VRCardView: React.FC<VRCardViewProps> = ({
  appearance,
  client,
  url = 'https://some.url',
}) => (
  <VRTestWrapper>
    <SmartCardProvider
      client={client}
      featureFlags={{ enableFlexibleBlockCard: true }}
    >
      <Card
        appearance={appearance}
        showServerActions={true}
        url={url}
        /* Embed-specific props */
        frameStyle="show"
      />
    </SmartCardProvider>
  </VRTestWrapper>
);

export default VRCardView;
