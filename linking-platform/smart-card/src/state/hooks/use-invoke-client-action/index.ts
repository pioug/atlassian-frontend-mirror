import { useCallback } from 'react';
import uuid from 'uuid';
import * as measure from '../../../utils/performance';
import type {
  InvokeClientActionProps,
  UseInvokeClientActionProps,
} from './types';

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
        // Begin analytics instrumentation.
        analytics?.ui.actionClickedEvent({
          id: experienceId,
          extensionKey,
          actionType,
          display,
          invokeType: 'client',
        });

        // Invoke action
        const result = await actionFn();

        measure.mark(markName, 'resolved');
        analytics?.operational.invokeSucceededEvent({
          id: experienceId,
          extensionKey,
          actionType,
          display,
        });

        return result;
      } catch (err) {
        measure.mark(markName, 'errored');
        const reason = typeof err === 'string' ? err : (err as any)?.message;
        analytics?.operational.invokeFailedEvent({
          id: experienceId,
          extensionKey,
          actionType,
          display,
          reason,
        });
      }
    },
    [analytics?.operational, analytics?.ui],
  );

export default useInvokeClientAction;
