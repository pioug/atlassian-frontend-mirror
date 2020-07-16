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
  FieldState,
  FieldSubscription,
  Unsubscribe,
} from 'final-form';
import createDecorator from 'final-form-focus';
import set from 'lodash.set';

import { OnSubmitHandler } from './types';

type DefaultValue<FieldValue> = (value?: FieldValue) => FieldValue;

type RegisterField = <FieldValue>(
  name: string,
  defaultValue: FieldValue | DefaultValue<FieldValue>,
  subscriber: (state: FieldState<FieldValue>) => void,
  subscription: FieldSubscription,
  config: FieldConfig<FieldValue>,
) => Unsubscribe;

export const FormContext = createContext<RegisterField>(function() {
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

export interface FormProps<FormData> {
  /* Children rendered inside the Form component. Function will be passed props from the form. */
  children: (args: {
    formProps: FormChildrenProps;
    disabled: boolean;
    dirty: boolean;
    submitting: boolean;
    getValues: () => FormData;
    setFieldValue: (name: string, value: any) => void;
    reset: (initialValues?: FormData) => void;
  }) => ReactNode;
  /* Called when the form is submitted without field validation errors */
  onSubmit: OnSubmitHandler<FormData>;
  /* When set the form and all fields will be disabled */
  isDisabled?: boolean;
}

function Form<FormData extends Record<string, any> = {}>(
  props: FormProps<FormData>,
) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const onSubmitRef = useRef(props.onSubmit);
  onSubmitRef.current = props.onSubmit;

  const form = useState(() => {
    const finalForm = createForm<FormData>({
      onSubmit: (...args) => onSubmitRef.current(...args),
      destroyOnUnregister: true,
      initialValues: {} as FormData,
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

    createDecorator<FormData>(() =>
      formRef.current
        ? Array.from(formRef.current.querySelectorAll('input'))
        : [],
    )(finalForm);

    return finalForm;
  })[0];

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

  const handleReset = (initialValues?: FormData) => {
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
          getValues: () => form.getState().values,
          setFieldValue: form.change,
        })}
      </IsDisabledContext.Provider>
    </FormContext.Provider>
  );
}

export default Form;
