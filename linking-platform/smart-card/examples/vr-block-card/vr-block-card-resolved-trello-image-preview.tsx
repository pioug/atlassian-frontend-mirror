import React from 'react';
import { JsonLd } from 'json-ld-types';
import { Client } from '@atlaskit/smart-card';
import VRCardView from '../utils/vr-card-view';
import { TrelloCard } from '../../examples-helpers/_jsonLDExamples';

class CustomClient extends Client {
  fetchData(url: string) {
    return Promise.resolve(TrelloCard as JsonLd.Response);
  }
}

export const BlockCardTrello = () => (
  <VRCardView appearance="block" client={new CustomClient()} />
);

export const BlockCardTrelloLegacy = () => (
  <VRCardView
    appearance="block"
    client={new CustomClient()}
    useLegacyBlockCard={true}
  />
);
