import { useCallback } from 'react';
import uuid from 'uuid';
import * as measure from '../../../utils/performance';
import {
  failUfoExperience,
  startUfoExperience,
  succeedUfoExperience,
} from '../../analytics';
import type {
  InvokeClientActionProps,
  UseInvokeClientActionProps,
} from './types';

const ACTION_EXPERIENCE_NAME = 'smart-link-action-invocation';

/**
 * Invoke client action such as preview, download and open link
 */
const useInvokeClientAction = ({ analytics }: UseInvokeClientActionProps) =>
  useCallback(
    async ({
      actionType,
      actionFn,
      extensionKey,
      display,
    }: InvokeClientActionProps) => {
      const experienceId = uuid();

      // Begin performance instrumentation.
      const markName = `${experienceId}-${actionType}`;
      measure.mark(markName, 'pending');

      try {
        // Begin UFO experience
        startUfoExperience(ACTION_EXPERIENCE_NAME, experienceId, {
          actionType,
          display,
          extensionKey,
          invokeType: 'client',
        });

        // Begin analytics instrumentation.
        analytics?.ui.actionClickedEvent({
          actionType,
          display,
        });

        // Invoke action
        const result = await actionFn();

        measure.mark(markName, 'resolved');
        succeedUfoExperience(ACTION_EXPERIENCE_NAME, experienceId);
        analytics?.operational.invokeSucceededEvent({
          actionType,
          display,
        });

        return result;
      } catch (err) {
        measure.mark(markName, 'errored');
        failUfoExperience(ACTION_EXPERIENCE_NAME, experienceId);
        const reason = typeof err === 'string' ? err : (err as any)?.message;
        analytics?.operational.invokeFailedEvent({
          actionType,
          display,
          reason,
        });
      }
    },
    [analytics?.operational, analytics?.ui],
  );

export default useInvokeClientAction;
