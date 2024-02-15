import React from 'react';

import { NotFoundClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export const BlockCardNotFoundView = () => (
  <VRCardView appearance="block" client={new NotFoundClient()} />
);

export const BlockCardNotFoundViewLegacy = () => (
  <VRCardView
    appearance="block"
    client={new NotFoundClient()}
    useLegacyBlockCard={true}
  />
);
