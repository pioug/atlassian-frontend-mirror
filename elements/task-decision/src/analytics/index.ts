import { createAndFireEvent } from '@atlaskit/analytics-next';

export const fabricElementsChannel = 'fabric-elements';

export const createAndFireEventInElementsChannel = createAndFireEvent(
  fabricElementsChannel,
);
