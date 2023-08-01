import type { Step } from '@atlaskit/editor-prosemirror/transform';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
  ACTION_SUBJECT,
  ACTION,
  EVENT_TYPE,
  getAnalyticsEventsFromTransaction,
} from '@atlaskit/editor-common/analytics';

const hasInvalidSteps = (tr: Transaction) =>
  ((tr.steps || []) as (Step & { from: number; to: number })[]).some(
    (step) => step.from > step.to,
  );

export default (dispatchAnalyticsEvent: DispatchAnalyticsEvent) => {
  return new SafePlugin({
    filterTransaction(transaction) {
      if (hasInvalidSteps(transaction)) {
        // eslint-disable-next-line no-console
        console.warn(
          'The transaction was blocked because it contains invalid steps',
          transaction.steps,
        );

        dispatchAnalyticsEvent({
          action: ACTION.DISCARDED_INVALID_STEPS_FROM_TRANSACTION,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: {
            analyticsEventPayloads:
              getAnalyticsEventsFromTransaction(transaction),
          },
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        return false;
      }

      return true;
    },
  });
};
