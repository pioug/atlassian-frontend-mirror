import React, {
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  type ComponentType,
  type Ref,
} from 'react';
import { mergeStyles, type OptionsOrGroups } from 'react-select';
import BaseSelect from 'react-select/base';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';

import { Input } from './components/input-aria-describedby';

import {
  SelectProps,
  OptionType,
  AsyncSelectProps,
  CreatableSelectProps,
  GroupType,
} from './types';
import {
  ClearIndicator,
  DropdownIndicator,
  LoadingIndicator,
  MultiValueRemove,
  IndicatorSeparator,
} from './components';
import baseStyles from './styles';
import {
  onFocus,
  isOptionsGrouped,
} from './utils/grouped-options-announcement';

type AtlaskitSelectProps<Option extends unknown, IsMulti extends boolean> =
  | SelectProps<Option, IsMulti>
  | AsyncSelectProps<Option, IsMulti>
  | CreatableSelectProps<Option, IsMulti>;

export default function createSelect(WrappedComponent: ComponentType<any>) {
  const AtlaskitSelect = forwardRef(function AtlaskitSelect<
    Option extends unknown = OptionType,
    IsMulti extends boolean = false,
  >(
    props: AtlaskitSelectProps<Option, IsMulti>,
    forwardedRef: Ref<BaseSelect>,
  ) {
    const {
      appearance,
      ariaLiveMessages,
      components: componentsProp,
      isInvalid, // TODO: set to true when cleaning up validationState prop so it has a default value
      onClickPreventDefault = true,
      spacing = 'default',
      styles = {},
      tabSelectsValue = false,
      validationState = 'default',
      ...restProps
    } = props;

    const internalSelectRef = useRef<BaseSelect>(null);

    const components = useMemo(
      () => ({
        ClearIndicator,
        DropdownIndicator,
        LoadingIndicator,
        MultiValueRemove,
        IndicatorSeparator,
        Input,
        ...componentsProp,
      }),
      [componentsProp],
    );

    const descriptionId = props['aria-describedby'];
    const isSearchable = props.isSearchable;
    useEffect(() => {
      if (!isSearchable && descriptionId) {
        // when isSearchable is false, react-select will create its own dummy input instead of using ours,
        // so we need to manually add the additional aria-describedby using ref.
        const input = internalSelectRef.current?.inputRef;
        const ariaDescribedby = input?.getAttribute('aria-describedby');
        if (!ariaDescribedby?.includes(descriptionId)) {
          input?.setAttribute(
            'aria-describedby',
            `${ariaDescribedby} ${descriptionId}`,
          );
        }
      }
    }, [descriptionId, isSearchable]);

    const isCompact = spacing === 'compact';

    return (
      <WrappedComponent
        // @ts-ignore - mergeRefs only supports HTMLElement
        ref={mergeRefs([forwardedRef, internalSelectRef])}
        aria-live="assertive"
        ariaLiveMessages={
          isOptionsGrouped(
            props.options as OptionsOrGroups<OptionType, GroupType<OptionType>>,
          )
            ? { onFocus, ...ariaLiveMessages }
            : { ...ariaLiveMessages }
        }
        tabSelectsValue={tabSelectsValue}
        onClickPreventDefault={onClickPreventDefault}
        {...restProps}
        components={components}
        styles={mergeStyles(
          baseStyles<Option, IsMulti>(
            // This will cover both props for invalid state while giving priority to isInvalid. When cleaning up validationState, we can just keep the inner condition.
            typeof isInvalid !== 'undefined'
              ? isInvalid
                ? 'error'
                : 'default'
              : validationState!,
            isCompact,
            appearance || 'default',
          ),
          styles,
        )}
      />
    );
  });
  AtlaskitSelect.displayName = 'AtlaskitSelect';
  return AtlaskitSelect as <
    Option extends unknown = OptionType,
    IsMulti extends boolean = false,
  >(
    props: AtlaskitSelectProps<Option, IsMulti> & { ref?: Ref<BaseSelect> },
  ) => JSX.Element;
}
