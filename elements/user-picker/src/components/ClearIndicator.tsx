import React from 'react';
import { components, IndicatorProps } from '@atlaskit/select';

const AsyncTooltip = React.lazy(() =>
  import(
    /* webpackChunkName: "@atlaskit-internal_@atlaskit/tooltip" */ '@atlaskit/tooltip'
  ).then((module) => {
    return {
      default: module.default,
    };
  }),
);

export class ClearIndicator extends React.PureComponent<IndicatorProps<any>> {
  private handleMouseDown = (event: React.MouseEvent) => {
    if (event && event.type === 'mousedown' && event.button !== 0) {
      return;
    }
    this.props.clearValue();
    // Prevent focus when clear on blurred state
    const { selectProps } = this.props;
    if (selectProps && !selectProps.isFocused) {
      event.stopPropagation();
    }
  };

  render() {
    const {
      selectProps: { clearValueLabel },
    } = this.props;
    const Indicator = (
      <components.ClearIndicator
        {...this.props}
        innerProps={{
          ...this.props.innerProps,
          onMouseDown: this.handleMouseDown,
        }}
      />
    );
    return clearValueLabel ? (
      <React.Suspense fallback={Indicator}>
        <AsyncTooltip content={clearValueLabel}>{Indicator}</AsyncTooltip>
      </React.Suspense>
    ) : (
      Indicator
    );
  }
}
