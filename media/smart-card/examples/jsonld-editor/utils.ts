import { JsonLd } from 'json-ld-types';
import { CardType } from '@atlaskit/linking-common';
import { SmartLinkStatus } from '../../src/constants';
import { response1 } from '../content/example-responses';

export const isResolvedOrErrored = (status: CardType) => {
  switch (status) {
    case SmartLinkStatus.Errored:
    case SmartLinkStatus.Fallback:
    case SmartLinkStatus.Forbidden:
    case SmartLinkStatus.NotFound:
    case SmartLinkStatus.Resolved:
    case SmartLinkStatus.Unauthorized:
      return true;
    default:
      return false;
  }
};

export const getDefaultResponse = (): JsonLd.Response =>
  response1 as JsonLd.Response;
