import React, { Component, ComponentType } from 'react';
import Select, { mergeStyles } from 'react-select';
import makeAnimated from 'react-select/animated';
import memoizeOne from 'memoize-one';
import isEqual from 'react-fast-compare';

import { SelectProps, SelectComponentsConfig, OptionType } from './types';
import * as defaultComponents from './components';
import baseStyles from './styles';

export default function createSelect(WrappedComponent: ComponentType<any>) {
  return class AtlaskitSelect<Option = OptionType> extends Component<
    SelectProps<Option>
  > {
    components: SelectComponentsConfig<Option> = {};

    select: Select<Option> | null = null;

    constructor(props: SelectProps<Option>) {
      super(props);
      this.cacheComponents = memoizeOne(this.cacheComponents, isEqual).bind(
        this,
      );
      this.cacheComponents(props.components || {}, props.enableAnimation);
    }

    static defaultProps = {
      enableAnimation: true,
      validationState: 'default',
      spacing: 'default',
      onClickPreventDefault: true,
      tabSelectsValue: false,
      components: {},
      styles: {},
    };

    UNSAFE_componentWillReceiveProps(nextProps: SelectProps<Option>) {
      this.cacheComponents(nextProps.components!, nextProps.enableAnimation);
    }

    cacheComponents = (
      components: SelectComponentsConfig<Option>,
      enableAnimation: boolean,
    ) => {
      this.components = enableAnimation
        ? makeAnimated({
            ...defaultComponents,
            ...components,
          })
        : {
            ...defaultComponents,
            ...components,
          };
    };

    focus() {
      if (this.select) this.select.focus();
    }

    blur() {
      if (this.select) this.select.blur();
    }

    onSelectRef = (ref: Select<Option>) => {
      this.select = ref;

      const { innerRef } = this.props;

      if (typeof innerRef === 'object') {
        innerRef.current = ref;
      }
      if (typeof innerRef === 'function') {
        innerRef(ref);
      }
    };

    render() {
      const {
        styles,
        validationState,
        spacing,
        isMulti,
        ...props
      } = this.props;
      const isCompact = spacing === 'compact';

      // props must be spread first to stop `components` being overridden
      return (
        <WrappedComponent
          ref={this.onSelectRef}
          isMulti={isMulti}
          {...props}
          components={this.components}
          styles={mergeStyles(baseStyles(validationState!, isCompact), styles!)}
        />
      );
    }
  };
}
