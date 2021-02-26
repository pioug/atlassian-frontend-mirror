import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  createForm,
  FieldConfig,
  FieldSubscriber,
  FieldSubscription,
  FormState,
  Unsubscribe,
} from 'final-form';
import createDecorator from 'final-form-focus';
import set from 'lodash/set';

import { OnSubmitHandler } from './types';

type DefaultValue<FieldValue> = (value?: FieldValue) => FieldValue;

type RegisterField = <FieldValue>(
  name: string,
  defaultValue: FieldValue | DefaultValue<FieldValue>,
  subscriber: FieldSubscriber<FieldValue>,
  subscription: FieldSubscription,
  config: FieldConfig<FieldValue>,
) => Unsubscribe;

export const FormContext = createContext<RegisterField>(function () {
  return () => {};
});
export const IsDisabledContext = createContext(false);

interface FormChildrenProps {
  ref: React.RefObject<HTMLFormElement>;
  onSubmit: (
    event?:
      | React.FormEvent<HTMLFormElement>
      | React.SyntheticEvent<HTMLElement>,
  ) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
}

export interface FormProps<FormValues> {
  /* Children rendered inside the Form component. Function will be passed props from the form. */
  children: (args: {
    formProps: FormChildrenProps;
    disabled: boolean;
    dirty: boolean;
    submitting: boolean;
    getState: () => FormState<FormValues>;

    /** @deprecated */
    getValues: () => FormValues;

    setFieldValue: (name: string, value: any) => void;
    reset: (initialValues?: FormValues) => void;
  }) => ReactNode;
  /* Called when the form is submitted without field validation errors */
  onSubmit: OnSubmitHandler<FormValues>;
  /* When set the form and all fields will be disabled */
  isDisabled?: boolean;
}

export default function Form<FormValues extends Record<string, any> = {}>(
  props: FormProps<FormValues>,
) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const onSubmitRef = useRef(props.onSubmit);
  onSubmitRef.current = props.onSubmit;

  const [form] = useState(() => {
    // Types here would break the existing API
    const finalForm = createForm<any>({
      onSubmit: (...args) => onSubmitRef.current(...args),
      destroyOnUnregister: true,
      initialValues: {},
      mutators: {
        setDefaultValue: (
          [name, defaultValue]: [string, {} | DefaultValue<any>],
          state,
        ) => {
          if (state.formState.initialValues) {
            const initialValues: any = state.formState.initialValues;
            const values: any = state.formState.values;
            const value =
              name && typeof defaultValue === 'function'
                ? defaultValue(initialValues[name])
                : defaultValue;

            /* eslint-disable no-param-reassign */
            set(initialValues, name, value);
            set(values, name, value);
            /* eslint-enable */
          }
        },
      },
    });

    createDecorator<FormValues>(() =>
      formRef.current
        ? Array.from(formRef.current.querySelectorAll('input'))
        : [],
    )(finalForm);

    return finalForm;
  });

  const [state, setState] = useState({
    dirty: false,
    submitting: false,
  });

  useEffect(() => {
    const unsubscribe = form.subscribe(
      ({ dirty, submitting }) => {
        setState({ dirty, submitting });
      },
      {
        dirty: true,
        submitting: true,
      },
    );

    return unsubscribe;
  }, [form]);

  const registerField = useCallback<RegisterField>(
    (name, defaultValue, subscriber, subscription, config) => {
      form.pauseValidation();
      const unsubscribe = form.registerField(
        name,
        subscriber,
        subscription,
        config,
      );

      form.mutators.setDefaultValue(name, defaultValue);
      form.resumeValidation();

      return unsubscribe;
    },
    [form],
  );

  const handleSubmit = (
    e?: React.FormEvent<HTMLFormElement> | React.SyntheticEvent<HTMLElement>,
  ) => {
    if (e) {
      e.preventDefault();
    }

    form.submit();
  };

  const handleReset = (initialValues?: FormValues) => {
    form.reset(initialValues);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && formRef.current) {
      const submitButton: HTMLElement | null = formRef.current.querySelector(
        'button:not([type]), button[type="submit"], input[type="submit"]',
      );
      if (submitButton) {
        submitButton.click();
      }
      e.preventDefault();
    }
  };

  const { isDisabled = false, children } = props;
  const { dirty, submitting } = state;

  return (
    <FormContext.Provider value={registerField}>
      <IsDisabledContext.Provider value={isDisabled}>
        {children({
          formProps: {
            onSubmit: handleSubmit,
            ref: formRef,
            onKeyDown: handleKeyDown,
          },
          dirty,
          reset: handleReset,
          submitting,
          disabled: isDisabled,
          getState: () => form.getState(),
          getValues: () => form.getState().values, // TODO: deprecate
          setFieldValue: form.change,
        })}
      </IsDisabledContext.Provider>
    </FormContext.Provider>
  );
}
