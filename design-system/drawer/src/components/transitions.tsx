import React, { Component, ComponentType } from 'react';

import { Transition } from 'react-transition-group';

import { layers } from '@atlaskit/theme/constants';

import { transitionDurationMs, transitionTimingFunction } from '../constants';

// Transitions
// ------------------------------

type Styles = { [index: string]: string | number | null };

interface TransitionProps {
  component?: ComponentType<any> | string;
  onExited?: (node: HTMLElement) => void;
  onEntered?: (node: HTMLElement, isAppearing: boolean) => void;
  shouldUnmountOnExit?: boolean;
  in: boolean;
}

interface HandlerProps {
  defaultStyles: Styles;
  transitionProps: {
    appear: boolean;
    mountOnEnter: boolean;
    unmountOnExit: boolean;
  };
  transitionStyles: {
    entering?: Styles;
    entered?: Styles;
    exiting?: Styles;
    exited?: Styles;
  };
}

const defaultTransitionProps = {
  appear: true,
  mountOnEnter: true,
  unmountOnExit: true,
};

class TransitionHandler extends Component<TransitionProps & HandlerProps> {
  static defaultProps = {
    component: 'div',
    transitionProps: defaultTransitionProps,
  };

  enterTimeout: ReturnType<typeof setTimeout> | undefined;

  componentWillUnmount() {
    this.clearEnterTimeout();
  }

  onEntered = (node: HTMLElement, isAppearing: boolean) => {
    const { onEntered } = this.props;
    if (onEntered) {
      // Delay onEntered callback to fix DS-6969
      // Can remove this hack with DS-7078
      this.enterTimeout = setTimeout(
        () => onEntered(node, isAppearing),
        transitionDurationMs,
      );
    }
  };

  clearEnterTimeout = () => {
    if (this.enterTimeout) {
      clearTimeout(this.enterTimeout);
    }
  };

  render() {
    const {
      component = 'div',
      in: inProp,
      onExited,
      onEntered,
      defaultStyles,
      transitionStyles,
      transitionProps,
      ...props
    } = this.props;
    const timeout = {
      enter: 0,
      exit: transitionDurationMs,
    };

    return (
      <Transition
        in={inProp}
        onExited={onExited}
        onExiting={this.clearEnterTimeout}
        onEntered={this.onEntered}
        timeout={timeout}
        {...transitionProps}
      >
        {(state: keyof HandlerProps['transitionStyles']) => {
          const style = {
            ...defaultStyles,
            ...transitionStyles[state],
          };

          const Tag: ComponentType<any> | string = component;

          return <Tag style={style} {...props} />;
        }}
      </Transition>
    );
  }
}

export const Fade: React.ComponentType<TransitionProps> = ({ ...props }) => (
  <TransitionHandler
    defaultStyles={{
      transition: `opacity ${transitionDurationMs}ms ${transitionTimingFunction}`,
      opacity: 0,
      position: 'fixed',
      zIndex: layers.blanket(),
    }}
    transitionStyles={{
      entering: { opacity: 0 },
      entered: { opacity: 1 },
    }}
    {...props}
  />
);

export const Slide: React.ComponentType<TransitionProps> = ({
  shouldUnmountOnExit = true,
  ...props
}) => (
  <TransitionHandler
    defaultStyles={{
      transition:
        `transform ${transitionDurationMs}ms ${transitionTimingFunction}, ` +
        `width ${transitionDurationMs}ms ${transitionTimingFunction}`,
      transform: 'translate3d(-100%,0,0)',
    }}
    transitionStyles={{
      // Unset transform so we do not create a new stacking context for fixed-position children - NAV-159
      entered: { transform: null },
      exited: { transform: 'translate3d(-100%,0,0)' },
    }}
    transitionProps={{
      ...defaultTransitionProps,
      unmountOnExit: shouldUnmountOnExit,
    }}
    {...props}
  />
);
