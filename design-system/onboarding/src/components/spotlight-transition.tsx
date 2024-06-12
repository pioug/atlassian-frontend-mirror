import React, { createContext, type ReactNode } from 'react';

import noop from '@atlaskit/ds-lib/noop';

interface SpotlightTransitionProps {
	/**
	 * Children that are conditionally rendered. The transition happens based
	 * on the existence or non-existence of children.
	 */
	children?: ReactNode;
}

interface State {
	currentChildren: ReactNode;
}

interface SpotlightTransitionContextModel {
	isOpen: boolean;
	onExited: () => void;
}

const SpotlightTransitionContext = createContext<SpotlightTransitionContextModel>({
	isOpen: true,

	onExited: noop,
});

// checks if children exist and are truthy
const hasChildren = (children: ReactNode) =>
	React.Children.count(children) > 0 &&
	(React.Children.map(children || false, (child) => !!child)?.filter(Boolean)?.length || 0) > 0;

/**
 * __Spotlight transition__
 *
 * A spotlight transition holds onto spotlights so they can fade out when exiting the viewport.
 *
 * - [Examples](https://atlassian.design/components/onboarding/examples)
 * - [Code](https://atlassian.design/components/onboarding/code)
 * - [Usage](https://atlassian.design/components/onboarding/usage)
 */
class SpotlightTransition extends React.Component<SpotlightTransitionProps, State> {
	static getDerivedStateFromProps(props: SpotlightTransitionProps, state: State) {
		const { currentChildren: previousChildren } = state;
		const exiting = hasChildren(previousChildren) && !hasChildren(props.children);
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
			<SpotlightTransitionContext.Provider
				value={{
					onExited: this.onExited,
					isOpen: hasChildren(this.props.children),
				}}
			>
				{this.state.currentChildren}
			</SpotlightTransitionContext.Provider>
		);
	}
}

/**
 * __Spotlight transition consumer__
 *
 * Used to consume the spotlight transition context through render props.
 *
 * @internal
 */
export const SpotlightTransitionConsumer = SpotlightTransitionContext.Consumer;

export default SpotlightTransition;
