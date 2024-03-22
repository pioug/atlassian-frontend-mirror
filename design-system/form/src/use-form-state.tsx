import { useContext, useEffect, useMemo, useState } from 'react';

import { FormState, FormSubscription } from 'final-form';

import { FormContext } from './form';

// Constantized to avoid a new object reference built every call
const defaultSubscriptionConfig: FormSubscription = { values: true };

/**
 * Build a simple hash for a given subscription object for use in a `useMemo` dependencies array.
 * This is because `{ values: true } !== { values: true }`, but `'values:true|' === 'values:true|'`
 *
 * @example { values: true, dirty: false } => 'values:true|dirty:false|'
 */
const getSubscriptionHash = (subscriptionConfig: FormSubscription): string => {
  let hash = '';
  for (const key in subscriptionConfig) {
    if (subscriptionConfig.hasOwnProperty(key)) {
      hash += `${key}:${subscriptionConfig[key as keyof FormSubscription]}|`;
    }
  }

  return hash;
};

/**
 * A hook to return a recent form state for use within the `<Form>` as it requires context access.
 * This is useful for previewing form state, or for building custom fields that need to react to form state.
 *
 * This should not be used as a way to persist form state into another form state, use `onSubmit` for proper form handling.
 *
 * @note On the initial render, this should be `undefined` as our form has not provided any state.
 */
export const useFormState = <FormValues extends Record<string, any>>(
  subscriptionConfig: FormSubscription = defaultSubscriptionConfig,
): FormState<FormValues> | undefined => {
  const { subscribe } = useContext(FormContext);
  const [state, setState] = useState<FormState<FormValues>>();

  /**
   * A hash for us to shallow compare the subscriptionConfig object to react to shallow changes, but avoid referential changes.
   * We avoid computing the hash if the subscription config has referential equality altogether.
   */
  const subscriptionConfigHash = useMemo(
    () => getSubscriptionHash(subscriptionConfig),
    [subscriptionConfig],
  );

  /**
   * Return a memoized version of the subscription config to only react to shallow changes, not referential changes.
   * Eg. calling `useFormState({ values: true })` twice will result in two different objects by reference, but not by shallow comparison.
   * This will ensure we don't re-subscribe to the form state when the subscription config is the same.
   */
  const config = useMemo(
    () => subscriptionConfig,
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally controlled with a hash to have an explicit shallow comparison
    [subscriptionConfigHash],
  );

  useEffect(() => {
    const unsubscribe = subscribe((formState) => {
      setState(formState as FormState<FormValues>);
    }, config);

    return () => unsubscribe();
  }, [subscribe, config]);

  return state;
};
