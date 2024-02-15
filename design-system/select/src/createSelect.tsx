import React, { Component, ComponentType } from 'react';
import {
  type ClearIndicatorProps,
  type GroupBase,
  mergeStyles,
  OptionsOrGroups,
} from 'react-select';
import BaseSelect from 'react-select/base';
import memoizeOne from 'memoize-one';
import isEqual from 'react-fast-compare';
import { Input } from './components/input-aria-describedby';

import {
  SelectProps,
  SelectComponentsConfig,
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

export default function createSelect(WrappedComponent: ComponentType<any>) {
  return class AtlaskitSelect<
    Option = OptionType,
    IsMulti extends boolean = false,
  > extends Component<
    | SelectProps<Option, IsMulti>
    | AsyncSelectProps<Option, IsMulti>
    | CreatableSelectProps<Option, IsMulti>
  > {
    components: SelectComponentsConfig<Option, IsMulti> = {};

    select: BaseSelect | null = null;

    constructor(props: SelectProps<Option, IsMulti>) {
      super(props);
      this.cacheComponents = memoizeOne(this.cacheComponents, isEqual).bind(
        this,
      );
      this.cacheComponents(props.components || {});
    }

    static defaultProps = {
      validationState: 'default',
      // TODO: uncomment the next line when cleaning up validationState prop so it has a default value
      // isInvalid: false,
      spacing: 'default',
      onClickPreventDefault: true,
      tabSelectsValue: false,
      components: { Input },
      styles: {},
    };

    UNSAFE_componentWillReceiveProps(nextProps: SelectProps<Option, IsMulti>) {
      this.cacheComponents(nextProps.components!);
    }

    cacheComponents = (components: SelectComponentsConfig<Option, IsMulti>) => {
      this.components = {
        ClearIndicator: ClearIndicator
          ? (ClearIndicator as React.ComponentType<
              ClearIndicatorProps<Option, IsMulti, GroupBase<Option>>
            >)
          : undefined,
        DropdownIndicator,
        LoadingIndicator,
        MultiValueRemove,
        IndicatorSeparator,
        ...components,
      };
    };

    focus() {
      if (this.select) {
        this.select.focus();
      }
    }

    blur() {
      if (this.select) {
        this.select.blur();
      }
    }

    onSelectRef = (ref: BaseSelect) => {
      this.select = ref;
    };

    componentDidMount(): void {
      const descriptionId = this.props['aria-describedby'];
      if (!this.props.isSearchable && descriptionId) {
        // when isSearchable is false, react-select will create its own dummy input instead of using ours,
        // so we need to manually add the additional aria-describedby using ref.
        const input = this.select?.inputRef;
        const ariaDescribedby = input?.getAttribute('aria-describedby');
        if (!ariaDescribedby?.includes(descriptionId)) {
          input?.setAttribute(
            'aria-describedby',
            `${ariaDescribedby} ${descriptionId}`,
          );
        }
      }
    }

    render() {
      const {
        styles,
        validationState,
        isInvalid,
        spacing,
        isMulti,
        appearance,
        ariaLiveMessages,
        ...props
      } = this.props;
      const isCompact = spacing === 'compact';

      // props must be spread first to stop `components` being overridden
      return (
        <WrappedComponent
          ref={this.onSelectRef}
          isMulti={isMulti}
          aria-live="assertive"
          ariaLiveMessages={
            isOptionsGrouped(
              this.props.options as OptionsOrGroups<
                OptionType,
                GroupType<OptionType>
              >,
            )
              ? { onFocus, ...ariaLiveMessages }
              : { ...ariaLiveMessages }
          }
          {...props}
          components={this.components}
          styles={mergeStyles(
            baseStyles<Option, IsMulti>(
              // This will cover both props for invalid state while giving priority to isInvalid. When cleaning up validationState, we can just keep the inner condition.
              typeof isInvalid !== 'undefined'
                ? isInvalid
                  ? 'error'
                  : 'default'
                : validationState!,
              isCompact,
              this.props.appearance || 'default',
            ),
            styles!,
          )}
        />
      );
    }
  };
}
