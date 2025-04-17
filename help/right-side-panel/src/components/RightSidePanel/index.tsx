import React from 'react';
import { Component, type ReactNode } from 'react';
import { canUseDOM } from 'exenv';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';

import { RightSidePanelDrawer, RightSidePanelDrawerContent, transitionDurationMs } from './styled';

export type TransitionStatus = 'unmounted' | 'exiting' | 'entering' | 'entered' | 'exited';

export interface Props {
	// Open/Closed state
	isOpen: boolean;
	// ID for the HTML tag where we want to attach the RightSidePanel
	attachPanelTo: string;
	// Right Hand Side panel content
	children?: ReactNode;
	// Don't animate the component when the component is mounted (false by default)
	skipAnimationOnMount?: boolean;
	// Mount component on enter (true by default)
	mountOnEnter?: boolean;
	// Unmount component on exit (true by default)
	unmountOnExit?: boolean;
	// Disable enter animation (false by default)
	disableEnterAnimation?: boolean;
	// Disable exit animation (false by default)
	disableExitAnimation?: boolean;
	// Function to be executed when the open animation finishes
	onOpenAnimationFinished?: () => void;
	// Function to be executed when the close animation finishes
	onCloseAnimationFinished?: () => void;
}

export interface State {
	entered: boolean;
	container?: Element | null; // Element in where the RightSidePanel will be attached
}

export class RightSidePanel extends Component<Props, State> {
	attachPanelTo = this.props.attachPanelTo;

	state = {
		entered: false,
		container: undefined,
	};

	componentDidMount() {
		this.setState({
			container: canUseDOM ? document.querySelector('#' + this.attachPanelTo) : undefined,
		});
	}

	renderDrawer(Container: HTMLElement): ReactNode {
		const {
			children,
			isOpen,
			skipAnimationOnMount = false,
			mountOnEnter = true,
			unmountOnExit = true,
			disableEnterAnimation = false,
			disableExitAnimation = false,
			onOpenAnimationFinished,
			onCloseAnimationFinished,
		} = this.props;

		return createPortal(
			<Transition
				in={isOpen}
				timeout={transitionDurationMs}
				mountOnEnter={mountOnEnter}
				unmountOnExit={unmountOnExit}
				appear={!skipAnimationOnMount}
				enter={!disableEnterAnimation}
				exit={!disableExitAnimation}
				onEntered={onOpenAnimationFinished}
				onExited={onCloseAnimationFinished}
			>
				{(state: TransitionStatus) => (
					<RightSidePanelDrawer transitionState={state}>
						<RightSidePanelDrawerContent>{children}</RightSidePanelDrawerContent>
					</RightSidePanelDrawer>
				)}
			</Transition>,
			Container,
		);
	}

	render() {
		const { container } = this.state;

		return !!container ? this.renderDrawer(container!) : null;
	}
}

export default RightSidePanel;
