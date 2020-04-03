import analyticsService from './service';
import { Command } from '../types';
import { AnalyticsProperties } from './handler';

export function commandWithAnalytics(
  analyticsEventName: string,
  properties?: AnalyticsProperties,
) {
  return (command: Command): Command => (state, dispatch?, view?) =>
    command(
      state,
      tr => {
        if (dispatch) {
          analyticsService.trackEvent(analyticsEventName, properties);
          dispatch(tr);
        }
      },
      view,
    );
}
