import React, { createContext, ReactNode } from 'react';

interface Props {
  /**
    Children that are conditionally rendered. The transition happens based
    on the existence or non-existence of children.
  */
  children?: ReactNode;
}

interface State {
  currentChildren: ReactNode;
}

interface TransitionContextType {
  isOpen: boolean;
  onExited: () => void;
}

const TransitionContext = createContext<TransitionContextType>({
  isOpen: true,
  onExited: () => {},
});

// checks if children exist and are truthy
const hasChildren = (children: ReactNode) =>
  React.Children.count(children) > 0 &&
  React.Children.map(children, child => !!child).filter(Boolean).length > 0;

class Transition extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    const { currentChildren: previousChildren } = state;
    const exiting =
      hasChildren(previousChildren) && !hasChildren(props.children);
    return {
      currentChildren: exiting ? previousChildren : props.children,
    };
  }

  state = {
    currentChildren: undefined,
  };

  onExited = () => {
    this.setState({
      currentChildren: this.props.children,
    });
  };

  render() {
    return (
      <TransitionContext.Provider
        value={{
          onExited: this.onExited,
          isOpen: hasChildren(this.props.children),
        }}
      >
        {this.state.currentChildren}
      </TransitionContext.Provider>
    );
  }
}

export const SpotlightTransitionConsumer = TransitionContext.Consumer;

export default Transition;
