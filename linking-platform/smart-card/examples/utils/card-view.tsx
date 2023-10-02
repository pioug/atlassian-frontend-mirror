import { ProviderProps, SmartCardProvider } from '@atlaskit/link-provider';
import { Card, CardProps } from '@atlaskit/smart-card';
import React from 'react';

export type CardViewProps = {
  appearance: CardProps['appearance'];
  client: ProviderProps['client'];
  url?: CardProps['url'];
};

const CardView: React.FC<CardViewProps> = ({
  appearance,
  client,
  url = 'https://some.url',
}) => (
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
);

export default CardView;
