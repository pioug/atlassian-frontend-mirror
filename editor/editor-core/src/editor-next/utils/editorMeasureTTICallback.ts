import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  fireAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import type { ExperienceStore } from '@atlaskit/editor-common/ufo';
import { EditorExperience } from '@atlaskit/editor-common/ufo';
import { getTTISeverity } from '@atlaskit/editor-common/utils';

import type { EditorProps } from '../../types/editor-props';
import type { PerformanceTracking } from '../../types/performance-tracking';

export default function editorMeasureTTICallback(
  tti: number,
  ttiFromInvocation: number,
  canceled: boolean,
  distortedDuration: boolean,
  performanceTracking: PerformanceTracking | undefined,
  featureFlags: EditorProps['featureFlags'],
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
  experienceStore?: ExperienceStore,
) {
  if (performanceTracking?.ttiTracking?.enabled && createAnalyticsEvent) {
    const ttiEvent: { payload: AnalyticsEventPayload } = {
      payload: {
        action: ACTION.EDITOR_TTI,
        actionSubject: ACTION_SUBJECT.EDITOR,
        attributes: { tti, ttiFromInvocation, canceled, distortedDuration },
        eventType: EVENT_TYPE.OPERATIONAL,
      },
    };
    if (performanceTracking!.ttiTracking?.trackSeverity) {
      const {
        ttiSeverityNormalThreshold,
        ttiSeverityDegradedThreshold,
        ttiFromInvocationSeverityNormalThreshold,
        ttiFromInvocationSeverityDegradedThreshold,
      } = performanceTracking!.ttiTracking;
      const { ttiSeverity, ttiFromInvocationSeverity } = getTTISeverity(
        tti,
        ttiFromInvocation,
        ttiSeverityNormalThreshold,
        ttiSeverityDegradedThreshold,
        ttiFromInvocationSeverityNormalThreshold,
        ttiFromInvocationSeverityDegradedThreshold,
      );
      ttiEvent.payload.attributes.ttiSeverity = ttiSeverity;
      ttiEvent.payload.attributes.ttiFromInvocationSeverity =
        ttiFromInvocationSeverity;
    }
    fireAnalyticsEvent(createAnalyticsEvent)(ttiEvent);
  }

  if (featureFlags?.ufo) {
    experienceStore?.mark(EditorExperience.loadEditor, ACTION.EDITOR_TTI, tti);
    experienceStore?.success(EditorExperience.loadEditor);
  }
}
