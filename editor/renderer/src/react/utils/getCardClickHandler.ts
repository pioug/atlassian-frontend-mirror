import type { EventHandlers } from '@atlaskit/editor-common/ui';

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
