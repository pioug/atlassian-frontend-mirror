import React, { Component } from 'react';

interface Props {
  timeout: number;
  component: React.ElementType;
  componentProps: { [key: string]: any };
}

interface State {
  hidden: boolean;
}

export class DelayedRender extends Component<Props, State> {
  state: State = {
    hidden: true,
  };

  componentDidMount() {
    window.setTimeout(() => {
      this.setState({ hidden: false });
    }, this.props.timeout);
  }

  render() {
    if (this.state.hidden) {
      return null;
    }
    const { component: Component, componentProps } = this.props;
    return <Component {...componentProps} />;
  }
}
