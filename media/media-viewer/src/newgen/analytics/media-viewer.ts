import { packageAttributes } from './index';
import {
  GasScreenEventPayload,
  GasCorePayload,
} from '@atlaskit/analytics-gas-types';

export const mediaViewerModalEvent = (): (
  | GasCorePayload
  | GasScreenEventPayload
) & {
  action: string;
} => {
  return {
    action: 'viewed',
    actionSubject: 'mediaViewerModal',
    eventType: 'screen',
    name: 'mediaViewerModal',
    attributes: {
      ...packageAttributes,
    },
  };
};
