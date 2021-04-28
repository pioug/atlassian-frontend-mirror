import React, { useContext } from 'react';

interface Props {
  /**
    Children that are conditionally rendered. The transition happens based
    on the existence or non-existence of children.
  */
  children?: React.ReactNode;
}

interface State {
  currentChildren: React.ReactNode;
}

const TransitionContext = React.createContext({
  isOpen: true,
  onExited: () => {},
});

// checks if children exist and are truthy
const hasChildren = (children: React.ReactNode) =>
  React.Children.count(children) > 0 &&
  React.Children.map(children, child => !!child).filter(Boolean).length > 0;

class Transition extends React.Component<Props, State> {
  state = {
    currentChildren: undefined,
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const { currentChildren: previousChildren } = state;
    const exiting =
      hasChildren(previousChildren) && !hasChildren(props.children);
    return {
      currentChildren: exiting ? previousChildren : props.children,
    };
  }

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

export const useModalTransition = () => {
  return useContext(TransitionContext);
};

export default Transition;
