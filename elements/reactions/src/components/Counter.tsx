import { N90, B400 } from '@atlaskit/theme/colors';
import cx from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { keyframes, style } from 'typestyle';

import { akHeight } from './utils';

const animationTime = 300;

export const countStyle = style({
  fontSize: '11px',
  color: N90,
  overflow: 'hidden',
  height: `${akHeight}px`,
  transition: `width ${animationTime}ms ease-in-out`,
});

export const highlightStyle = style({
  color: B400,
  fontWeight: 600,
});

export const containerStyle = style({
  display: 'flex',
  flexDirection: 'column',
});

const slideAnimation = (start: number, end: number) => {
  const animation = keyframes({
    '0%': {
      transform: `translateY(${start}%)`,
    },
    '100%': {
      transform: `translateY(${end}%)`,
    },
  });
  return `${animation} ${animationTime}ms ease-in-out`;
};

const counterAnimation = (start: number, end: number) =>
  style({ animation: slideAnimation(start, end) });

export const slideUpStyle = counterAnimation(0, -50);
export const slideDownStyle = counterAnimation(-50, 0);

export type Props = {
  value: number;
  highlight?: boolean;
  limit?: number;
  overLimitLabel?: string;
  className?: string;
};

export type State = {
  previous?: {
    value: number;
    highlight?: boolean;
  };
};

export class Counter extends React.PureComponent<Props, State> {
  static defaultProps = {
    highlight: false,
    limit: 100,
    overLimitLabel: '99+',
    className: undefined,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      previous: undefined,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { value, highlight } = this.props;
    if (
      value !== undefined &&
      value !== nextProps.value &&
      (!this.hasReachedLimit(value) || !this.hasReachedLimit(nextProps.value))
    ) {
      this.setState({ previous: { value, highlight } });
    }
  }

  private getLabel = (value: number): string => {
    const { overLimitLabel } = this.props;
    if (this.hasReachedLimit(value)) {
      return overLimitLabel || '';
    } else if (value === 0) {
      return '';
    } else {
      return value.toString();
    }
  };

  private hasReachedLimit = (value: number) =>
    this.props.limit && value >= this.props.limit;

  private renderPrevious = () => {
    const { previous } = this.state;
    if (previous !== undefined) {
      const className = cx({ [highlightStyle]: previous.highlight });
      return (
        <div key={previous.value} className={className}>
          {this.getLabel(previous.value)}
        </div>
      );
    }
    return null;
  };

  private clearPrevious = () => {
    this.setState({ previous: undefined });
  };

  render() {
    const { value, highlight, className: classNameProp } = this.props;
    const { previous } = this.state;

    const label = this.getLabel(value);

    const increase = previous !== undefined && previous.value < value;
    const decrease = previous !== undefined && previous.value > value;

    const enterClass = increase
      ? slideUpStyle
      : decrease
      ? slideDownStyle
      : undefined;

    const className = cx(countStyle, classNameProp);

    const currentClassName = cx({ [highlightStyle]: highlight });

    // WS-2525 With the pill UI updates, width of * 10 was too much so dropped down to * 7
    return (
      <div className={className} style={{ width: label.length * 7 }}>
        <CSSTransition
          classNames={{ enter: enterClass }}
          timeout={animationTime}
          in={increase || decrease}
          onEntered={this.clearPrevious}
        >
          <div className={containerStyle}>
            {increase ? this.renderPrevious() : null}
            <div className={currentClassName} key={value}>
              {label}
            </div>
            {decrease ? this.renderPrevious() : null}
          </div>
        </CSSTransition>
      </div>
    );
  }
}
