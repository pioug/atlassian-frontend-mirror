import { ProviderProps, SmartCardProvider } from '@atlaskit/link-provider';
import { Card, CardProps } from '@atlaskit/smart-card';
import React from 'react';

export type CardViewProps = {
  appearance: CardProps['appearance'];
  client: ProviderProps['client'];
  isSelected?: CardProps['isSelected'];
  url?: CardProps['url'];
  useLegacyBlockCard?: boolean;
};

const CardView: React.FC<CardViewProps> = ({
  appearance,
  client,
  isSelected,
  url = 'https://some.url',
  useLegacyBlockCard = false,
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
      isSelected={isSelected}
      useLegacyBlockCard={useLegacyBlockCard}
    />
  </SmartCardProvider>
);

export default CardView;
