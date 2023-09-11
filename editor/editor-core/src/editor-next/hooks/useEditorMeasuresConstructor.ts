/** @jsx jsx */

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { useConstructor } from '@atlaskit/editor-common/hooks';
import type { ExperienceStore } from '@atlaskit/editor-common/ufo';
import { measureTTI, startMeasure } from '@atlaskit/editor-common/utils';

import type { EditorProps } from '../../types/editor-props';
import type { PerformanceTracking } from '../../types/performance-tracking';
import measurements from '../../utils/performance/measure-enum';
import editorMeasureTTICallback from '../utils/editorMeasureTTICallback';

/**
 *
 * Hook to be used for running analytics on mounting the editor.
 * Should run once.
 * WARNING: Consider any changes to also make to `src/editor.tsx`
 *
 * @param performanceTracking
 * @param featureFlags
 * @param getExperienceStore function to retrieve the Editor's current ExperienceStore
 * @param createAnalyticsEvent
 */
export default function useEditorConstructor(
  performanceTracking: PerformanceTracking | undefined,
  featureFlags: EditorProps['featureFlags'],
  getExperienceStore: () => ExperienceStore | undefined,
  createAnalyticsEvent: CreateUIAnalyticsEvent,
): void {
  useConstructor(() => {
    startMeasure(measurements.EDITOR_MOUNTED);

    if (performanceTracking?.ttiTracking?.enabled || featureFlags?.ufo) {
      measureTTI(
        (tti, ttiFromInvocation, canceled, distortedDuration) => {
          editorMeasureTTICallback(
            tti,
            ttiFromInvocation,
            canceled,
            distortedDuration,
            performanceTracking,
            featureFlags,
            createAnalyticsEvent,
            getExperienceStore(),
          );
        },
        performanceTracking?.ttiTracking?.ttiIdleThreshold,
        performanceTracking?.ttiTracking?.ttiCancelTimeout,
      );
    }
  });
}
