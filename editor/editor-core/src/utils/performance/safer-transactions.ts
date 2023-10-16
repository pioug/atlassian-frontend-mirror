import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';

export const UNSAFE_PROPERTY_SET_ERROR =
  'Setting an unsafe property on transaction after dispatch!';

// since selection uses curSelection under the hood, we guard setSelection instead
const isUnsafeMethod = (prop: PropertyKey) =>
  ['setSelection'].includes(prop.toString());
const isReadOnlyProperty = (prop: PropertyKey) =>
  ['doc', 'docs', 'steps', 'selection'].includes(prop.toString());

interface FreezeUnsafeTransactionOptions {
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  pluginKey?: string;
}

export const freezeUnsafeTransactionProperties = <TrType extends object>({
  dispatchAnalyticsEvent,
  pluginKey,
}: FreezeUnsafeTransactionOptions): ProxyHandler<TrType> => {
  const isUnsafe = () => {
    if (dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.TRANSACTION_MUTATED_AFTER_DISPATCH,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          pluginKey: pluginKey || 'unknown',
        },
        nonPrivacySafeAttributes: {
          stack: new Error().stack,
        },
      });
    }
    throw new Error(UNSAFE_PROPERTY_SET_ERROR);
  };
  return {
    get: function (target, prop, receiver) {
      if (isUnsafeMethod(prop)) {
        isUnsafe();
      }

      return Reflect.get(target, prop, receiver);
    },
    set: function (target, prop, receiver) {
      if (isReadOnlyProperty(prop)) {
        isUnsafe();
      }

      return Reflect.set(target, prop, receiver);
    },
  };
};
