import { useMemo } from 'react';
import { SmartLinkEvents } from '../../utils/analytics/analytics';

export function useSmartLinkEvents() {
  /**
   * this utility maybe extended in the future to include
   * more contextual info about SLs
   */
  const events = useMemo(() => new SmartLinkEvents(), []);
  return events;
}
