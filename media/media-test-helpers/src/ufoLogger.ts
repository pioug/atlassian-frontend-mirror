import { CustomData } from '@atlaskit/ufo';

export interface UfoPayloadPublisher {
  setup: (properties: any) => void;
}

export const enableMediaUfoLogger = (
  ufoPayloadPublisher: UfoPayloadPublisher,
  properties: CustomData = {},
) => {
  // Added try catch as Performance is not mocked properly in the Ufo packages.
  // By adding try catch test are successfully passing. Created ticket for the same - MEET-2652
  const MEDIA_UFO_OPERATIONAL_EVENT = 'Media::UFO::sendOperationalEvent:';
  try {
    ufoPayloadPublisher.setup({
      product: 'examples',
      gasv3: {
        sendOperationalEvent: (event: any) => {
          // eslint-disable-next-line
          console.log(MEDIA_UFO_OPERATIONAL_EVENT, event);
        },
      },
      app: { version: { web: 'unknown' } },
      ...properties,
    });
  } catch (e) {
    // eslint-disable-next-line
    console.log(`${MEDIA_UFO_OPERATIONAL_EVENT}Error:`, e);
  }
};
