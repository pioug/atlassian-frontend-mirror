import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { ACTION } from '@atlaskit/editor-common/analytics';
import {
  ACTION_SUBJECT,
  EVENT_TYPE,
  fireAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import type { ExperienceStore } from '@atlaskit/editor-common/ufo';
import { EditorExperience } from '@atlaskit/editor-common/ufo';

import type { EditorProps } from '../../types/editor-props';

/**
 *
 * Util function to be used with the Editor component to send duration analytics
 *
 * @param action
 * @param props
 * @param getExperienceStore return the ExperienceStore of the Editor
 * @param getCreateAnalyticsEvent return the CreateUIAnalyticsEvent of the Editor
 * @returns
 */
export default function sendDurationAnalytics(
  action: ACTION.EDITOR_MOUNTED | ACTION.ON_EDITOR_READY_CALLBACK,
  props: Pick<EditorProps, 'contextIdentifierProvider' | 'featureFlags'>,
  getExperienceStore: () => ExperienceStore | undefined,
  createAnalyticsEvent: CreateUIAnalyticsEvent | undefined,
) {
  return async (duration: number, startTime: number) => {
    const contextIdentifier = await props.contextIdentifierProvider;
    const objectId = contextIdentifier?.objectId;

    if (createAnalyticsEvent) {
      fireAnalyticsEvent(createAnalyticsEvent)({
        payload: {
          action,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: {
            duration,
            startTime,
            objectId,
          },
          eventType: EVENT_TYPE.OPERATIONAL,
        },
      });
    }

    if (props.featureFlags?.ufo) {
      const experienceStore = getExperienceStore();
      experienceStore?.mark(
        EditorExperience.loadEditor,
        action,
        startTime + duration,
      );
      experienceStore?.addMetadata(EditorExperience.loadEditor, {
        objectId,
      });
    }
  };
}
