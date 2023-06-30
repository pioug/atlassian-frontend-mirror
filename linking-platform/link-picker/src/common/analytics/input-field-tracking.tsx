import React, { useCallback, useRef } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import createEventPayload, {
  LinkPickerAnalyticsContextType,
} from '../../common/utils/analytics/analytics.codegen';
import { ANALYTICS_CHANNEL } from '../constants';

import { useLinkPickerAnalytics } from './index';

type InputFields = 'link' | 'displayText';

const isEventWithInputType = (
  e: unknown,
): e is {
  inputType: unknown;
} => {
  return typeof e === 'object' && e !== null && 'inputType' in e;
};

const getChangeEventInputMethodType = (
  event: React.ChangeEvent<HTMLInputElement>,
): 'paste' | 'manual' => {
  if (
    isEventWithInputType(event.nativeEvent) &&
    typeof event.nativeEvent.inputType === 'string' &&
    event.nativeEvent.inputType.includes('insertFromPaste')
  ) {
    return 'paste';
  }
  return 'manual';
};

/**
 * Wraps an input field and connects it to the link picker analytics context to provide a baseline of analytics tracking
 * @param WrappedComponent The input field to be tracked
 * @param field The name of the field (ie matching actionSubjectId)
 * @param filterOnChangeEventAttrs Function to hook into and filter/customise the default attribute tracking logic
 * @returns HOC Input field with tracking
 */
export const withInputFieldTracking = <
  P extends {
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear?: Function;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  },
  Field extends InputFields,
>(
  WrappedComponent: React.ComponentType<P>,
  field: Field,
  filterOnChangeEventAttrs: <
    OnChangeAttributes extends Partial<LinkPickerAnalyticsContextType>,
  >(
    event: React.ChangeEvent<HTMLInputElement>,
    attributes: OnChangeAttributes,
  ) => OnChangeAttributes = (_, attributes) => attributes,
  // TODO: Consider refactor to use template literal type if it makes these more usable / safe / dev friendly
  // contentTypeFn: (value: string) => LinkPickerAnalyticsContextType[`${Field}FieldContent`],
): React.ComponentType<P> => {
  return props => {
    const { onBlur, onChange, onClear, onFocus } = props;
    const { trackAttribute, trackAttributes } = useLinkPickerAnalytics();
    const { createAnalyticsEvent } = useAnalyticsEvents();

    // Ref to track if the value of the field has changed between focus and blur
    const valueOnFocus: React.MutableRefObject<string | null> =
      useRef<string>(null);

    // Track the content and input method on every direct change to the input
    const handleOnChange: Required<P>['onChange'] = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        // TODO: See above re template literal, improve typesafety here
        // trackAttribute(`${field}FieldContent`, contentTypeFn(event.currentTarget.value));
        // trackAttribute(`${field}FieldContentInputMethod`, methodTypeFn(event));
        trackAttributes(
          filterOnChangeEventAttrs(event, {
            [`${field}FieldContent`]: Boolean(event.currentTarget.value)
              ? 'text_string'
              : null,
            [`${field}FieldContentInputMethod`]:
              getChangeEventInputMethodType(event),
          }),
        );
        onChange?.(event);
      },
      [onChange, trackAttributes],
    );

    // Store the value of the field at the time the field is focused so we can know if it changes when the user's focus leaves
    const handleOnFocus: Required<P>['onFocus'] = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        valueOnFocus.current = event.currentTarget.value;
        onFocus?.(event);
      },
      [onFocus],
    );

    // Fire updated events only when the user's focus leaves the field
    const handleOnBlur: Required<P>['onBlur'] = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        // Only fire if the value has changed since the field was focused (we are only concerned with the net change to the field)
        if (event.currentTarget.value !== valueOnFocus.current) {
          createAnalyticsEvent(
            createEventPayload(`ui.textField.updated.${field}Field`, {}),
          ).fire(ANALYTICS_CHANNEL);
        }
        onBlur?.(event);
      },
      [onBlur, createAnalyticsEvent],
    );

    // Track the values as null when the text field is cleared
    const handleOnClear: Required<P>['onClear'] = useCallback(
      (...args) => {
        trackAttribute(`${field}FieldContent`, null);
        trackAttribute(`${field}FieldContentInputMethod`, null);
        onClear?.(...args);
      },
      [onClear, trackAttribute],
    );

    return (
      <WrappedComponent
        {...props}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
        onClear={handleOnClear}
        onFocus={handleOnFocus}
      />
    );
  };
};
