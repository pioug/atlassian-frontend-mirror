import React from 'react';

interface Props {
  /**
   Whether the modal for this stack position is open
  */
  isOpen: boolean;
  /**
   Children is a function that gets passed the current stack index
  */
  children: (index: number) => React.ReactNode;
}

interface State {
  stackIndex: number;
}

// This is the source of truth for open modals
let stackConsumers: (() => void)[] = [];

// This component provides the position of a modal dialog in the list of all open dialogs.
// The key behaviours are:
// - When a modal renders for the first time it takes the first stack position
// - When a modal mounts, all other modals have to adjust their position
// - When a modal unmounts, all other modals have to adjust their position
class StackConsumer extends React.Component<Props, State> {
  state = {
    stackIndex: 0,
  };

  componentDidMount() {
    stackConsumers.forEach(updateFn => updateFn());
  }

  componentWillUnmount() {
    // This check will pass if the <Transition><Modal/></Transition> pattern has not been
    // implemented correctly. In this case, will still need to make sure we remove ourselves
    // from the stack list.
    if (stackConsumers.indexOf(this.update) !== -1) {
      stackConsumers = stackConsumers.filter(stack => stack !== this.update);
      stackConsumers.forEach(updateFn => updateFn());
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isOpen && !this.props.isOpen) {
      stackConsumers = stackConsumers.filter(stack => stack !== this.update);
      stackConsumers.forEach(updateFn => updateFn());
    }
  }

  update = () => {
    const stackIndex = stackConsumers.indexOf(this.update);
    if (this.state.stackIndex !== stackIndex) {
      this.setState({ stackIndex });
    }
  };

  render() {
    if (stackConsumers.indexOf(this.update) === -1) {
      // add this instance to stack consumer list
      stackConsumers = [this.update, ...stackConsumers];
    }
    return this.props.children(this.state.stackIndex);
  }
}

export default StackConsumer;
