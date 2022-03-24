import { payloadPublisher } from '@atlassian/ufo';

type SendOperationEventHandler = (payload: unknown) => unknown;

/**
 * The publisher will be set up in product side in the real world, We add it in the example here so we can see events coming from UFO in the console browser object
 * @param product name of application
 * @param {SendOperationEventHandler} (Optional) callback when a ufo event is occuring
 * @param {string} version (Optional) the web application version (defaults to "1.0.0")
 * @returns {void}
 */
export const setupPublisher = ({
  product,
  onSendOperationalEvent = (event) => {
    // eslint-disable-next-line no-console
    console.log('ufoEvent:', event);
  },
  version = '1.0.0',
}: {
  product: string;
  onSendOperationalEvent?: SendOperationEventHandler;
  version?: string;
}) => {
  payloadPublisher.setup({
    product,
    gasv3: {
      sendOperationalEvent: onSendOperationalEvent,
    },
    app: { version: { web: version } },
  });
};
