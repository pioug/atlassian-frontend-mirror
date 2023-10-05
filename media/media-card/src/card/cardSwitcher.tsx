import React from 'react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import CardLoader, { CardWithMediaClientConfigProps } from './cardLoader';
import CardV2Loader from './v2/cardV2Loader';

function CardSwitcher(props: CardWithMediaClientConfigProps) {
  return getBooleanFF('platform.media-experience.cardv2_7zann') ? (
    <CardV2Loader {...props} />
  ) : (
    <CardLoader {...props} />
  );
}

export default CardSwitcher;
