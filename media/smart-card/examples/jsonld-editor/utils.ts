import { CardType } from '@atlaskit/linking-common';
import { SmartLinkStatus } from '../../src/constants';

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
