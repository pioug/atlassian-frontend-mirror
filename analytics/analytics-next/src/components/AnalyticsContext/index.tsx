import LegacyAnalyticsContext from './LegacyAnalyticsContext';
import ModernAnalyticsContext from './ModernAnalyticsContext';
import { AnalyticsContextFunction } from './types';

let ExportedAnalyticsContext: AnalyticsContextFunction;
if (
  typeof process !== 'undefined' &&
  process.env['ANALYTICS_NEXT_MODERN_CONTEXT']
) {
  ExportedAnalyticsContext = ModernAnalyticsContext as any;
} else {
  ExportedAnalyticsContext = LegacyAnalyticsContext as any;
}

export default ExportedAnalyticsContext;
