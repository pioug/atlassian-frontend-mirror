import { ReadonlyTransaction, Transaction } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';

import { AnalyticsStep } from '@atlaskit/adf-schema/steps';

import {
  AnalyticsEventPayload,
  AnalyticsEventPayloadWithChannel,
} from './types';

export function getAnalyticsEventsFromTransaction(
  tr: Transaction | ReadonlyTransaction,
): AnalyticsEventPayloadWithChannel[] {
  return (tr.steps as Step[])
    .filter<AnalyticsStep<AnalyticsEventPayload>>(
      (step: Step): step is AnalyticsStep<AnalyticsEventPayload> =>
        step instanceof AnalyticsStep,
    )
    .reduce<AnalyticsEventPayloadWithChannel[]>(
      (acc, step) => [...acc, ...step.analyticsEvents],
      [],
    );
}
