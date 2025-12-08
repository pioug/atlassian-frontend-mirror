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
//
// positionedOverEditor is used to determine whether the context panel is positioned over the Editor so we are
// able to position and add margins to handle certain elements like inline comment dialogues overlapping the context
// panel

export type ContextPanelContext = {
	broadcastPosition: (positionedOverEditor: boolean) => void;
	broadcastWidth: (width: number) => void;
	positionedOverEditor: boolean;
	width: number;
};

export const ContextPanel = React.createContext<ContextPanelContext>({
	width: 0,
	positionedOverEditor: false,
	broadcastWidth: () => {},
	broadcastPosition: () => {},
});

export type ContextPanelProviderState = {
	positionedOverEditor?: boolean;
	width?: number;
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, @typescript-eslint/no-explicit-any
export class ContextPanelWidthProvider extends React.Component<any, ContextPanelProviderState> {
	state = { width: 0, positionedOverEditor: false };

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

	broadcastPosition = (positionedOverEditor: boolean) => {
		if (positionedOverEditor !== this.state.positionedOverEditor) {
			this.setState({
				positionedOverEditor,
			});
		}
	};

	render(): React.JSX.Element {
		const { width, positionedOverEditor } = this.state;

		return (
			<Provider
				value={{
					width,
					positionedOverEditor,
					broadcastWidth: this.broadcastSidebarWidth,
					broadcastPosition: this.broadcastPosition,
				}}
			>
				{this.props.children}
			</Provider>
		);
	}
}

const { Provider, Consumer } = ContextPanel;

export { Provider as ContextPanelProvider, Consumer as ContextPanelConsumer };
