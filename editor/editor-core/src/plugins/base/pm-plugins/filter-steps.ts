import { Step } from 'prosemirror-transform';
import { Plugin, Transaction } from 'prosemirror-state';
import { analyticsService } from '../../../analytics';
import {
  DispatchAnalyticsEvent,
  ACTION_SUBJECT,
  ACTION,
  EVENT_TYPE,
  getAnalyticsEventsFromTransaction,
} from '../../analytics';

const hasInvalidSteps = (tr: Transaction) =>
  ((tr.steps || []) as (Step & { from: number; to: number })[]).some(
    step => step.from > step.to,
  );

export default (dispatchAnalyticsEvent: DispatchAnalyticsEvent) => {
  return new Plugin({
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
            analyticsEventPayloads: getAnalyticsEventsFromTransaction(
              transaction,
            ),
          },
          eventType: EVENT_TYPE.OPERATIONAL,
        });

        // Temporarily dispatch legacy GasV2 event in parallel
        analyticsService.trackEvent('atlaskit.fabric.editor.invalidstep', {
          message: 'Blocked transaction with invalid steps',
        });

        return false;
      }

      return true;
    },
  });
};
