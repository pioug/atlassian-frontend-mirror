import { DateLozenge, Color } from './DateLozenge';
import React from 'react';
import format from 'date-fns/format';

export type ValueType = number;

export type OnClick = (
  value: ValueType,
  event: React.SyntheticEvent<any>,
) => void;

export type Props = {
  onClick?: OnClick;
  value: ValueType;
  format?: string;
  color?: Color;
  className?: string;
  children?: React.StatelessComponent<Props> | string | React.ReactNode;
};

const isClickable = <
  P extends { onClick?: OnClick },
  T extends P & { onClick: OnClick }
>(
  props: P,
): props is T => !!props.onClick;

export class Date extends React.Component<Props> {
  static displayName = 'Date';
  static defaultProps: Partial<Props> = {
    format: 'dd/MM/yyyy',
    color: 'grey',
  };

  handleOnClick = (event: React.SyntheticEvent<any>) => {
    if (isClickable(this.props)) {
      this.props.onClick(this.props.value, event);
    }
  };

  renderContent = () => {
    if (this.props.children) {
      if (typeof this.props.children === 'function') {
        return (this.props.children as React.StatelessComponent<Props>)(
          this.props,
        );
      }
      return this.props.children;
    }
    return format(this.props.value, this.props.format || '');
  };

  render() {
    return (
      <DateLozenge
        className={this.props.className}
        onClick={isClickable(this.props) ? this.handleOnClick : undefined}
        color={this.props.color}
      >
        {this.renderContent()}
      </DateLozenge>
    );
  }
}
