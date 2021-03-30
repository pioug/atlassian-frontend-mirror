import LegacyAnalyticsListener from './LegacyAnalyticsListener';
import ModernAnalyticsListener from './ModernAnalyticsListener';
import { AnalyticsListenerFunction } from './types';

let ExportedAnalyticsListener: AnalyticsListenerFunction;
if (
  typeof process !== 'undefined' &&
  process.env['ANALYTICS_NEXT_MODERN_CONTEXT']
) {
  ExportedAnalyticsListener = ModernAnalyticsListener as any;
} else {
  ExportedAnalyticsListener = LegacyAnalyticsListener as any;
}

export default ExportedAnalyticsListener;
