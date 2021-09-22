/** @jsx jsx */
import React, {
  FormEvent,
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { css, jsx } from '@emotion/core';
import { FieldState } from 'final-form';
import { uid } from 'react-uid';
import invariant from 'tiny-invariant';

import { R400 } from '@atlaskit/theme/colors';
import { useGlobalTheme } from '@atlaskit/theme/components';
import {
  fontFamily as getFontFamily,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { h200 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { FormContext, IsDisabledContext } from './form';

const gridSize = getGridSize();
const fontFamily = getFontFamily();

interface LabelProps {
  fieldId: string;
}

const fieldWrapperStyles = css({
  marginTop: `${gridSize}px`,
});

const labelStyles = css({
  display: 'inline-block',
  marginTop: 0,
  marginBottom: `${gridSize * 0.5}px`,
  fontFamily: `${fontFamily}`,
});

const requiredIndicatorStyles = css({
  paddingLeft: `${gridSize * 0.25}px`,
  color: `${token('color.text.danger', R400)}`,
  fontFamily: `${fontFamily}`,
});

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const lightH200Styles = css(h200({ theme: { mode: 'light' } }));
// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const darkH200Styles = css(h200({ theme: { mode: 'dark' } }));

const Label: React.FC<LabelProps> = ({ children, fieldId }) => {
  const { mode } = useGlobalTheme();
  return (
    <label
      css={[mode === 'light' ? lightH200Styles : darkH200Styles, labelStyles]}
      id={`${fieldId}-label`}
      htmlFor={fieldId}
    >
      {children}
    </label>
  );
};

function isEvent(event: any): event is FormEvent<SupportedElements> {
  return Boolean(event && event.target);
}

function isFunction<T>(x: T | ((value?: T) => T)): x is (value?: T) => T {
  return typeof x === 'function';
}

type SupportedElements =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export interface FieldProps<
  FieldValue,
  Element extends SupportedElements = HTMLInputElement
> {
  id: string;
  isRequired: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
  // This can be either an event or value as `onChange` might not be applied
  // directly to a DOM element. For example, it might be a react-select
  onChange: (value: FormEvent<Element> | FieldValue) => void;
  onBlur: () => void;
  onFocus: () => void;
  value: FieldValue;
  name: string;
  'aria-invalid': 'true' | 'false';
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  'aria-labelledby': string;
}

export interface Meta {
  dirty: boolean;
  dirtySinceLastSubmit: boolean;
  submitFailed: boolean;
  submitting: boolean;
  touched: boolean;
  valid: boolean;
  error?: string;
  submitError?: boolean;
  validating?: boolean;
}

export interface FieldComponentProps<
  FieldValue,
  Element extends SupportedElements
> {
  /**
   * Content to render in the field. This is a function that is called with props for the field component and other information about the field.
   */
  children: (args: {
    fieldProps: FieldProps<FieldValue, Element>;
    error?: string;
    // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
    valid: boolean;
    meta: Meta;
  }) => React.ReactNode;
  /**
   * Sets the default value of the field. If a function is provided, it is called with the current default value of the field.
   */
  defaultValue?:
    | FieldValue
    | ((currentDefaultValue?: FieldValue) => FieldValue);
  /**
   * Passed to the ID attribute of the field. This is randomly generated if it is not specified.
   */
  id?: string;
  /**
   * Sets whether the field is required for submission. Required fields are marked with a red asterisk.
   */
  isRequired?: boolean;
  /**
   * Sets whether the field is disabled. Users cannot edit or focus on the fields. If the parent form component is disabled, then the field will always be disabled.
   */
  isDisabled?: boolean;
  /**
   * Label displayed above the form field.
   */
  label?: ReactNode;
  /**
   * Specifies the name of the field. This is important for referencing the form data.
   */
  name: string;
  /**
   * Access the current field value and transform it to return a different field value.
   */
  transform?: (
    event: FormEvent<Element> | FieldValue,
    current: FieldValue,
  ) => FieldValue;
  /**
   * Checks whether the field input is valid. This is usually used to display a message relevant to the current value using `ErrorMessage`, `HelperMessage` or `ValidMessage`.
   */
  validate?: (
    value: FieldValue | undefined,
    formState: Object,
    fieldState: Meta,
  ) => string | void | Promise<string | void>;
}

interface State<FieldValue, Element extends SupportedElements> {
  fieldProps: {
    onChange: (value: FormEvent<Element> | FieldValue) => void;
    onBlur: () => void;
    onFocus: () => void;
    value: FieldValue;
  };
  error?: string;
  valid: boolean;
  meta: Meta;
}

/**
 * __Field id__
 *
 * A field id uses the context API. It provides the id of the field to message components. This links the message with the field of screenreaders.
 */
export const FieldId = React.createContext<string | undefined>(undefined);

function usePreviousRef<T>(current: T): MutableRefObject<T> {
  const ref = useRef(current);

  // will be updated on the next render
  useEffect(() => {
    ref.current = current;
  });

  // return the existing current (pre render)
  return ref;
}

function isShallowEqual<FieldValue>(
  previousValue: FieldValue,
  currentValue: FieldValue,
) {
  if (previousValue === currentValue) {
    return true;
  }

  // not checking functions
  if (
    typeof previousValue === 'function' &&
    typeof currentValue === 'function'
  ) {
    return true;
  }

  if (Array.isArray(previousValue) && Array.isArray(currentValue)) {
    return JSON.stringify(previousValue) === JSON.stringify(currentValue);
  }

  if (typeof previousValue === 'object' && typeof currentValue === 'object') {
    return JSON.stringify(previousValue) === JSON.stringify(currentValue);
  }

  return false;
}

export default function Field<
  FieldValue = string,
  Element extends SupportedElements = HTMLInputElement
>(props: FieldComponentProps<FieldValue, Element>) {
  const registerField = useContext(FormContext);
  const isDisabled = useContext(IsDisabledContext) || props.isDisabled || false;
  const defaultValue = isFunction<FieldValue | undefined>(props.defaultValue)
    ? props.defaultValue()
    : props.defaultValue;

  const [state, setState] = useState<State<FieldValue, Element>>({
    fieldProps: {
      onChange: () => {},
      onBlur: () => {},
      onFocus: () => {},
      /* Previously, defaultValue was being set as undefined in Field.defaultProps, which
       * effectively made it an optional prop to external consumers of Field. However the
       * prop types defined defaultValue as required, so inside the component it was not
       * valid for defaultValue to be undefined. We need to suppress the error
       * after changing defaultValue to explictly be an optional prop.
       */
      // @ts-ignore
      value: defaultValue,
    },
    error: undefined,
    valid: false,
    meta: {
      dirty: false,
      dirtySinceLastSubmit: false,
      touched: false,
      valid: false,
      validating: false,
      submitting: false,
      submitFailed: false,
      error: undefined,
      submitError: undefined,
    },
  });

  const latestPropsRef = usePreviousRef(props);
  const latestStateRef = usePreviousRef(state);

  /**
   * HACK: defaultValue can potentially be an array or object which cannot be
   * passed directly into a `useEffect` dependency array, since it will trigger
   * the hook every time.
   */
  const hasDefaultValueChanged = isShallowEqual(
    latestPropsRef.current.defaultValue,
    props.defaultValue,
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
      invariant(
        latestPropsRef.current.name,
        '@atlaskit/form: Field components have a required name prop',
      );
    }

    function fieldStateToMeta(
      value: Partial<FieldState<FieldValue>> = {},
    ): Meta {
      return {
        dirty: value.dirty || false,
        dirtySinceLastSubmit: value.dirtySinceLastSubmit || false,
        touched: value.touched || false,
        valid: value.valid || false,
        submitting: value.submitting || false,
        submitFailed: value.submitFailed || false,
        error: value.error,
        submitError: value.submitError,
        validating: !!value.validating,
      };
    }

    const unregister = registerField<FieldValue>(
      latestPropsRef.current.name,
      // @ts-ignore
      latestPropsRef.current.defaultValue,
      (fieldState) => {
        /**
         * Do not update dirtySinceLastSubmit until submission has finished.
         */
        const modifiedDirtySinceLastSubmit = fieldState.submitting
          ? latestStateRef.current.meta.dirtySinceLastSubmit
          : fieldState.dirtySinceLastSubmit;

        /**
         * Do not update submitFailed until submission has finished.
         */
        const modifiedSubmitFailed = fieldState.submitting
          ? latestStateRef.current.meta.submitFailed
          : fieldState.submitFailed;

        /**
         * Do not use submitError if the value has changed.
         */
        const modifiedSubmitError =
          modifiedDirtySinceLastSubmit && latestPropsRef.current.validate
            ? undefined
            : fieldState.submitError;
        const modifiedError =
          modifiedSubmitError ||
          ((fieldState.touched || fieldState.dirty) && fieldState.error);

        /**
         * If there has been a submit error, then use logic in modifiedError to determine validity,
         * so we can determine when there is a submit error which we do not want to display
         * because the value has been changed.
         */
        const modifiedValid = modifiedSubmitFailed
          ? modifiedError === undefined
          : fieldState.valid;

        function getTransform(
          eventOrValue: FormEvent<Element> | FieldValue,
          currentValue: FieldValue,
        ): FieldValue | boolean | string | undefined {
          if (latestPropsRef.current.transform) {
            return latestPropsRef.current.transform(eventOrValue, currentValue);
          }

          if (isEvent(eventOrValue)) {
            const { currentTarget } = eventOrValue;

            if (currentTarget.type === 'checkbox') {
              //@ts-expect-error TODO Fix legit TypeScript 3.9.6 improved inference error
              if ((currentTarget as HTMLInputElement).checked) {
                return currentTarget.value || true;
              }

              return currentTarget.value ? undefined : false;
            } else if (currentTarget) {
              return currentTarget.value;
            }
          } else {
            return eventOrValue;
          }
        }

        setState({
          fieldProps: {
            onChange: (e) => {
              fieldState.change(
                getTransform(
                  e as FormEvent<Element>,
                  fieldState.value! as FieldValue,
                ) as FieldValue,
              );
            },
            onBlur: fieldState.blur,
            onFocus: fieldState.focus,
            value: fieldState.value!,
          },
          error: modifiedError || undefined,
          /**
           * The following parameters are optionally typed in final-form to indicate that not all parameters need
           * to be subscribed to. We cast them as booleans (using || false), since this is what they are semantically.
           */
          valid: modifiedValid || false,
          meta: fieldStateToMeta(fieldState),
        });
      },
      {
        dirty: true,
        dirtySinceLastSubmit: true,
        touched: true,
        valid: true,
        submitting: true,
        submitFailed: true,
        value: true,
        error: true,
        submitError: true,
        validating: true,
      },
      {
        getValidator: () =>
          function validate(
            value: FieldValue,
            formState: Object,
            fieldState?: FieldState<FieldValue>,
          ) {
            const supplied = latestPropsRef.current.validate;
            if (supplied && fieldState) {
              return supplied(value, formState, fieldStateToMeta(fieldState));
            }
          },
      },
    );
    return unregister;
  }, [
    latestPropsRef,
    latestStateRef,
    registerField,
    props.name,
    hasDefaultValueChanged,
  ]);

  const fieldId = useMemo(
    // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
    () => (props.id ? props.id : `${props.name}-${uid({ id: props.name })}`),
    [props.id, props.name],
  );

  const extendedFieldProps = {
    ...state.fieldProps,
    name: props.name,
    isDisabled,
    isInvalid: Boolean(state.error),
    isRequired: Boolean(props.isRequired),
    'aria-invalid': (state.error ? 'true' : 'false') as 'true' | 'false',
    'aria-labelledby': `${fieldId}-label ${fieldId}-helper ${fieldId}-valid ${fieldId}-error`,
    id: fieldId,
  };

  return (
    <div css={fieldWrapperStyles}>
      {props.label && (
        <Label fieldId={fieldId}>
          {props.label}
          {props.isRequired && (
            <span css={requiredIndicatorStyles} aria-hidden="true">
              *
            </span>
          )}
        </Label>
      )}
      <FieldId.Provider value={fieldId}>
        {props.children({
          fieldProps: extendedFieldProps,
          error: state.error,
          valid: state.valid,
          meta: state.meta,
        })}
      </FieldId.Provider>
    </div>
  );
}
