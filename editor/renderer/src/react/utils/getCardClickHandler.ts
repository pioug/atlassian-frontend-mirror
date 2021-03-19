import { EventHandlers } from '@atlaskit/editor-common';

import { getEventHandler } from '../../utils';

export const getCardClickHandler = (
  eventHandlers?: EventHandlers,
  url?: string,
) => {
  const handler = getEventHandler(eventHandlers, 'smartCard');

  return handler
    ? (e: React.MouseEvent<HTMLElement>) => handler(e, url)
    : undefined;
};
