import React from 'react';

// React context to communicate the active context panel width up and down the tree.
//
// We need the width prop from the ContextPanel component.
//
// However, the actual <ContextPanel /> component might be deeply nested inside the contextPanel.
// For example, in the template context panel storybook, we wrap it in 2 higher order components.
//
// Changing the max-width on the main editor container happens above where the <ContextPanel /> gets rendered.
//
// To subtract the context panel width from the available real estate, we use the Provider and Consumer.

export type ContextPanelContext = {
  width: number;
  broadcastWidth: (width: number) => void;
};

const { Provider, Consumer } = React.createContext<ContextPanelContext>({
  width: 0,
  broadcastWidth: () => {},
});

export type ContextPanelProviderState = {
  width?: number;
};

export class ContextPanelWidthProvider extends React.Component<
  any,
  ContextPanelProviderState
> {
  state = { width: 0 };

  constructor(props: any) {
    super(props);
  }

  broadcastSidebarWidth = (width: number) => {
    if (width !== this.state.width) {
      this.setState({
        width,
      });
    }
  };

  render() {
    const { width } = this.state;

    return (
      <Provider value={{ width, broadcastWidth: this.broadcastSidebarWidth }}>
        {this.props.children}
      </Provider>
    );
  }
}

export { Provider as ContextPanelProvider, Consumer as ContextPanelConsumer };
