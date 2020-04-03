import React, { Component, ComponentType } from 'react';
import { getDisplayName } from '../utils';

// export interface InternalHandlerProps {}

export interface WithPseudoStateProps {
  href?: string;
  isActive?: boolean;
  isFocus?: boolean;
  isHover?: boolean;
  isInteractive?: boolean;
  onBlur?: (...args: any) => void;
  onClick?: (...args: any) => void;
  onFocus?: (...args: any) => void;
  onKeyDown?: (...args: any) => void;
  onKeyUp?: (...args: any) => void;
  onMouseDown?: (...args: any) => void;
  onMouseEnter?: (...args: any) => void;
  onMouseLeave?: (...args: any) => void;
  onMouseUp?: (...args: any) => void;
}

export interface State {
  isActive: boolean;
  isFocus: boolean;
  isHover: boolean;
  isInteractive: boolean;
}

export default function withPseudoState<Props extends WithPseudoStateProps>(
  WrappedComponent: ComponentType<Props>,
) {
  return class ComponentWithPseudoState extends Component<Props, State> {
    static displayName = getDisplayName('withPseudoState', WrappedComponent);

    component: React.Ref<Props> = null;

    actionKeys: string[] = [];

    UNSAFE_componentWillMount() {
      const { href, isInteractive, onClick } = this.props;

      if (href || isInteractive || onClick) {
        this.actionKeys = onClick || isInteractive ? ['Enter', ' '] : ['Enter'];
      }
    }

    state: State = {
      isActive: Boolean(this.props.isActive),
      isFocus: Boolean(this.props.isActive),
      isHover: Boolean(this.props.isActive),
      isInteractive: Boolean(
        this.props.href || this.props.isInteractive || this.props.onClick,
      ),
    };

    blur = () => {
      // @ts-ignore reaching into the instance
      if (this.component && this.component.blur) this.component.blur();
    };

    focus = () => {
      // @ts-ignore reaching into the instance
      if (this.component && this.component.focus) this.component.focus();
    };

    setComponent = (component: React.Ref<any>) => {
      this.component = component;
    };

    onBlur = (...args: any[]) => {
      this.setState({ isActive: false, isFocus: false });

      if (this.props.onBlur) {
        this.props.onBlur(...args);
      }
    };

    onFocus = (...args: any[]) => {
      this.setState({ isFocus: true });

      if (this.props.onFocus) {
        this.props.onFocus(...args);
      }
    };

    onMouseLeave = (...args: any[]) => {
      this.setState({ isActive: false, isHover: false });

      if (this.props.onMouseLeave) {
        this.props.onMouseLeave(...args);
      }
    };

    onMouseEnter = (...args: any[]) => {
      this.setState({ isHover: true });

      if (this.props.onMouseEnter) {
        this.props.onMouseEnter(...args);
      }
    };

    onMouseUp = (...args: any[]) => {
      this.setState({ isActive: false });

      if (this.props.onMouseUp) {
        this.props.onMouseUp(...args);
      }
    };

    onMouseDown = (...args: any[]) => {
      this.setState({ isActive: true });

      if (this.props.onMouseDown) {
        this.props.onMouseDown(...args);
      }
    };

    onKeyDown = (event: KeyboardEvent, ...rest: any[]) => {
      if (this.actionKeys.indexOf(event.key) > -1) {
        this.setState({ isActive: true });
      }

      if (this.props.onKeyDown) {
        this.props.onKeyDown(event, ...rest);
      }
    };

    onKeyUp = (event: KeyboardEvent, ...rest: any[]) => {
      if (this.actionKeys.indexOf(event.key) > -1) {
        this.setState({ isActive: false });
      }

      if (this.props.onKeyUp) {
        this.props.onKeyUp(event, ...rest);
      }
    };

    render() {
      return (
        <WrappedComponent
          ref={this.setComponent}
          {...this.state}
          {...this.props}
          {...(this.state.isInteractive && {
            onBlur: this.onBlur,
            onFocus: this.onFocus,
            onMouseLeave: this.onMouseLeave,
            onMouseEnter: this.onMouseEnter,
            onMouseUp: this.onMouseUp,
            onMouseDown: this.onMouseDown,
            onKeyDown: this.onKeyDown,
            onKeyUp: this.onKeyUp,
          })}
        />
      );
    }
  };
}
