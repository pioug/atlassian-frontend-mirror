import React from 'react';

import { FormSpy as FinalFormSpy } from 'react-final-form';

export type FormSpyProps<T> = {
  children: ({ values }: { values: T }) => React.ReactNode;
};

/**
 * Lightweight wrapper around the react-final-form
 * FormSpy component so that we can control selectively
 * how much of the API we are commited to.
 */
export const FormSpy = <T extends Record<string, unknown>>({
  children,
}: FormSpyProps<T>) => {
  return (
    <FinalFormSpy<T, T> subscription={{ values: true }}>
      {props => children({ values: props.values })}
    </FinalFormSpy>
  );
};
